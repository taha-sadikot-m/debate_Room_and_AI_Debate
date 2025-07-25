import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Copy, Mic, MicOff, ArrowLeft, MessageSquare, User, Users, Camera, CameraOff, MonitorOff, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
// Import polyfills first for WebRTC
import "@/utils/polyfills";
// Use our custom wrapper for simple-peer
import { createPeerConnection, getUserMedia } from '@/utils/webRTCWrapper';

interface HumanDebateRoomProps {
  onBack: () => void;
  onViewHistory?: () => void;
}

interface DebateMessage {
  id: string;
  roomId: string;
  sender: string;
  senderName: string;
  message: string;
  side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  timestamp: number;
}

interface RoomUser {
  id: string;
  name: string;
  side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' | null;
  isActive: boolean;
  lastSeen: number;
}

interface DebateRoom {
  id: string;
  topic: string;
  createdBy: string;
  createdAt: number;
  status: 'waiting' | 'active' | 'completed';
}

const HumanDebateRoom: React.FC<HumanDebateRoomProps> = ({ onBack, onViewHistory }) => {
  // Room state
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string>('');
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const [isRoomActive, setIsRoomActive] = useState<boolean>(false);
  const [isRoomHost, setIsRoomHost] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [mySide, setMySide] = useState<'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' | null>(null);
  const [userId] = useState<string>(`user-${uuidv4().substring(0, 8)}`);
  const [userName, setUserName] = useState<string>(`Guest-${Math.floor(Math.random() * 100)}`);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debateEnded, setDebateEnded] = useState<boolean>(false);
  const [opponentConnected, setOpponentConnected] = useState<boolean>(false);
  
  // Video states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  
  // Store offer for delayed processing if needed
  const [videoOffer, setVideoOffer] = useState<any>(null);
  const [videoAnswer, setVideoAnswer] = useState<any>(null);
  const [iceCandidate, setIceCandidate] = useState<any[]>([]);
  
  // Video refs
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const roomChannelRef = useRef<any>(null);
  const peerRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Generate a random room ID
  const generateRoomId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  useEffect(() => {
    if (isCreatingRoom) {
      setRoomId(generateRoomId());
    }
    
    // Clean up real-time connections when component unmounts
    return () => {
      if (roomChannelRef.current) {
        roomChannelRef.current.unsubscribe();
      }
      
      // Clean up room data from localStorage if host
      if (isRoomHost && roomId) {
        cleanupRoom();
      }
      
      // Make sure to clean up video streams and WebRTC connections
      cleanupVideo();
    }
  }, [isCreatingRoom]);
  
  // Always scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Real-time connection management
  useEffect(() => {
    if (!roomId || !isRoomActive) return;

    console.log(`Room activated: ${roomId}, isHost: ${isRoomHost}`);
    
    // Set up the real-time connection
    setupRealTimeConnection();
    
    // Store current room ID in localStorage
    localStorage.setItem('current_debate_room_id', roomId);
    
    // Load existing messages for this room
    loadRoomMessages();
    
  }, [roomId, isRoomActive]);
  
  // Set up real-time connection
  const setupRealTimeConnection = () => {
    console.log(`Setting up real-time connection for room: ${roomId}`);
    
    try {
      // Clean up any existing connection
      if (roomChannelRef.current) {
        roomChannelRef.current.unsubscribe();
      }
      
      // Join the room
      const roomChannel = supabase.channel(`debate-room-${roomId}`, {
        config: {
          broadcast: {
            self: false
          },
          presence: {
            key: userId,
          },
        },
      });

      // Set up real-time event handlers
      roomChannel
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
          updateUsersPresence(newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          removeUserPresence(leftPresences);
        })
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync occurred');
          // Get all present users when sync happens
          const presenceState = roomChannel.presenceState();
          const allUsers = Object.values(presenceState).flat() as any[];
          console.log('Current presence state:', allUsers);
          updateAllUsers(allUsers);
        })
        .on('broadcast', { event: 'debate-message' }, (payload) => {
          console.log('Received message:', payload);
          addMessage(payload.payload as DebateMessage);
        })
        .on('broadcast', { event: 'select-side' }, (payload) => {
          console.log('User selected side:', payload);
          updateUserSide(payload.payload.userId, payload.payload.side);
        })
        .on('broadcast', { event: 'end-debate' }, (payload) => {
          console.log('Debate ended by:', payload);
          handleDebateEnd();
        })
        .on('broadcast', { event: 'request-room-info' }, async (payload) => {
          console.log('Room info requested:', payload);
          // Only the host should respond to room info requests
          if (isRoomHost && payload && payload.payload && payload.payload.userId) {
            await roomChannel.send({
              type: 'broadcast',
              event: 'room-info',
              payload: { 
                topic: topic,
                roomId: roomId,
                createdBy: userId,
                createdAt: Date.now()
              },
            });
          }
        })
        // WebRTC video events
        .on('broadcast', { event: 'camera-on' }, (payload) => {
          console.log('User turned camera on:', payload);
          // If we're the host and our camera is on, initiate connection
          if (isRoomHost && isCameraOn && payload.payload.userId !== userId && stream) {
            initiatePeerConnection(stream);
          }
          toast({
            title: "Camera Activated",
            description: "Another participant has turned their camera on.",
          });
        })
        .on('broadcast', { event: 'camera-off' }, (payload) => {
          console.log('User turned camera off:', payload);
          // Handle remote user turning off camera
          if (payload.payload.userId !== userId) {
            toast({
              title: "Camera Deactivated",
              description: "Another participant has turned their camera off.",
            });
          }
        })
        .on('broadcast', { event: 'webrtc-offer' }, (payload) => {
          console.log('Received WebRTC offer:', payload);
          // Handle the WebRTC offer if it's not from us
          if (payload.payload.userId !== userId) {
            handleReceivedOffer(payload.payload.offer);
          }
        })
        .on('broadcast', { event: 'webrtc-answer' }, (payload) => {
          console.log('Received WebRTC answer:', payload);
          // Handle the WebRTC answer if it's not from us
          if (payload.payload.userId !== userId) {
            handleReceivedAnswer(payload.payload.answer);
          }
        })
        .on('broadcast', { event: 'webrtc-signal' }, (payload) => {
          console.log('Received WebRTC signal:', payload);
          // Handle WebRTC signal if it's not from us
          if (payload.payload.userId !== userId) {
            handleIceCandidate(payload.payload.signal);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to room:', roomId);
            try {
              // Track the user's presence in the room
              await roomChannel.track({
                id: userId,
                name: userName,
                side: mySide,
                isActive: true,
                lastSeen: Date.now(),
              });
              
              console.log('Successfully tracked presence for user:', userId);
              
              // Get the current state to ensure we're properly tracked
              setTimeout(() => {
                const state = roomChannel.presenceState();
                console.log('Current presence state after tracking:', state);
                
                // Get all users from presence state
                const allUsers = Object.values(state).flat() as any[];
                updateAllUsers(allUsers);
              }, 1000);
              
            } catch (error) {
              console.error('Error tracking presence:', error);
            }
          } else {
            console.error('Failed to subscribe to room:', status);
          }
        });
      
      // Store the channel reference
      roomChannelRef.current = roomChannel;
    } catch (error) {
      console.error('Error setting up real-time connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to debate room. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  // Effect to handle delayed video offer processing
  useEffect(() => {
    if (videoOffer && stream) {
      // Now that we have the stream, we can process the stored offer
      handleReceivedOffer(videoOffer);
      // Clear the stored offer after processing
      setVideoOffer(null);
    }
  }, [videoOffer, stream]);
  
  // Check if there are active videos when the opponent connection changes
  useEffect(() => {
    if (opponentConnected && isCameraOn && stream) {
      // If we're the host, initiate the connection
      if (isRoomHost) {
        initiatePeerConnection(stream);
      }
    }
  }, [opponentConnected, isCameraOn]);
  
  // Update video element when stream changes
  useEffect(() => {
    if (myVideoRef.current && stream) {
      myVideoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  // Update remote video element when remoteStream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  // Check if there are opponents in the room
  const checkForOpponent = () => {
    // Filter users who aren't the current user and have selected a debate side (not observers or evaluators)
    const opponents = users.filter(u => u.id !== userId && u.side !== null && u.side !== 'OBSERVER' && u.side !== 'EVALUATOR');
    
    // If there's at least one opponent, mark opponent as connected
    setOpponentConnected(opponents.length > 0);
  }

  // Helper functions for user presence
  const updateAllUsers = (presences: any[]) => {
    console.log('Updating all users with presence data:', presences);
    const allUsers = presences.map((presence: any) => ({
      id: presence.id || presence.key,
      name: presence.name || 'Guest',
      side: presence.side,
      isActive: presence.isActive || true,
      lastSeen: presence.lastSeen || Date.now(),
    }));
    
    // Replace the entire users list with the current presence state
    setUsers(allUsers);
    console.log('Updated users list:', allUsers);
    
    // Update opponent connection status
    const opponents = allUsers.filter(u => u.id !== userId && u.side !== null && u.side !== 'OBSERVER' && u.side !== 'EVALUATOR');
    setOpponentConnected(opponents.length > 0);
  }
  
  const updateUsersPresence = (presences: any[]) => {
    console.log('Updating users presence with new data:', presences);
    const newUsers = presences.map((presence: any) => ({
      id: presence.id || presence.key,
      name: presence.name || 'Guest',
      side: presence.side,
      isActive: presence.isActive || true,
      lastSeen: presence.lastSeen || Date.now(),
    }));
    
    setUsers(prevUsers => {
      // Merge with existing users, updating any that already exist
      const existingUserIds = prevUsers.map(u => u.id);
      const newUsersToAdd = newUsers.filter(u => !existingUserIds.includes(u.id));
      const updatedExistingUsers = prevUsers.map(existingUser => {
        const matchingNewUser = newUsers.find(nu => nu.id === existingUser.id);
        return matchingNewUser || existingUser;
      });
      
      const updatedUsers = [...updatedExistingUsers, ...newUsersToAdd];
      console.log('Updated users after presence update:', updatedUsers);
      
      // Update opponent connection status
      const opponents = updatedUsers.filter(u => u.id !== userId && u.side !== null && u.side !== 'OBSERVER' && u.side !== 'EVALUATOR');
      setOpponentConnected(opponents.length > 0);
      
      return updatedUsers;
    });
  };

  const removeUserPresence = (presences: any[]) => {
    const userIdsToRemove = presences.map(p => p.id || p.key);
    setUsers(prevUsers => {
      const filteredUsers = prevUsers.filter(user => !userIdsToRemove.includes(user.id));
      
      // Update opponent connection status
      const opponents = filteredUsers.filter(u => u.id !== userId && u.side !== null && u.side !== 'OBSERVER' && u.side !== 'EVALUATOR');
      setOpponentConnected(opponents.length > 0);
      
      return filteredUsers;
    });
  };

  const updateUserSide = (userId: string, side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR') => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId ? { ...user, side } : user
      );
      
      // Update opponent connection status
      const opponents = updatedUsers.filter(u => u.id !== userId && u.side !== null && u.side !== 'OBSERVER' && u.side !== 'EVALUATOR');
      setOpponentConnected(opponents.length > 0);
      
      return updatedUsers;
    });
  };

  // Message handling
  const addMessage = (message: DebateMessage) => {
    setMessages(prev => {
      // Prevent duplicate messages
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
    
    // Store messages in localStorage for persistence
    const roomMessages = JSON.parse(localStorage.getItem(`debate_room_${roomId}_messages`) || '[]');
    if (!roomMessages.some((m: DebateMessage) => m.id === message.id)) {
      const updatedMessages = [...roomMessages, message];
      localStorage.setItem(`debate_room_${roomId}_messages`, JSON.stringify(updatedMessages));
    }
    
    scrollToBottom();
  };
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Load existing messages for this room from localStorage
  const loadRoomMessages = () => {
    try {
      const roomMessages = JSON.parse(localStorage.getItem(`debate_room_${roomId}_messages`) || '[]');
      if (roomMessages.length > 0) {
        setMessages(roomMessages);
      }
    } catch (error) {
      console.error('Error loading room messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !roomId || !isRoomActive || !mySide) {
      toast({
        title: "Cannot Send Message",
        description: mySide ? "Please enter a message" : "Please select a role first",
        variant: "destructive",
      });
      return;
    }

    // Prevent observers from sending messages (but allow evaluators)
    if (mySide === 'OBSERVER') {
      toast({
        title: "Observers Cannot Send Messages",
        description: "As an observer, you can only watch the debate. To participate, change your role to FOR, AGAINST, or EVALUATOR.",
        variant: "destructive",
      });
      return;
    }

    const newMessage: DebateMessage = {
      id: `msg-${uuidv4()}`,
      roomId,
      sender: userId,
      senderName: userName,
      message: currentMessage.trim(),
      side: mySide,
      timestamp: Date.now(),
    };

    try {
      // Send via real-time
      await roomChannelRef.current.send({
        type: 'broadcast',
        event: 'debate-message',
        payload: newMessage,
      });

      // Also add locally for immediate feedback
      addMessage(newMessage);
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to Send",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Create a new room
  const createRoom = async () => {
    setIsLoading(true);
    
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a debate topic",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Create a new room ID
      const newRoomId = roomId || generateRoomId();
      setRoomId(newRoomId);
      
      // Store room data in localStorage
      const roomData: DebateRoom = {
        id: newRoomId,
        topic: topic.trim(),
        createdBy: userId,
        createdAt: Date.now(),
        status: 'waiting',
      };
      
      localStorage.setItem(`debate_room_${newRoomId}`, JSON.stringify(roomData));
      localStorage.setItem(`debate_room_${newRoomId}_host`, JSON.stringify({
        id: userId,
        name: userName,
        topic: topic.trim(),
        createdAt: Date.now()
      }));
      localStorage.setItem('current_debate_room_id', newRoomId);
      localStorage.setItem(`debate_room_${newRoomId}_messages`, JSON.stringify([]));
      
      // Activate the room
      setIsRoomActive(true);
      setIsRoomHost(true);
      
      toast({
        title: "Room Created Successfully!",
        description: `Room ID: ${newRoomId}. Share this with participants to join.`,
      });
      
      // Immediately set up the real-time connection as host
      console.log('Setting up real-time connection as host for room:', newRoomId);
      
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Room Creation Failed",
        description: "Failed to create debate room. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Join an existing room
  const joinRoom = async () => {
    setIsLoading(true);
    
    if (!joinRoomId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room ID",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const roomIdToJoin = joinRoomId.toUpperCase();
      console.log(`Attempting to join room: ${roomIdToJoin}`);
      
      // First check if room exists in localStorage (for local testing)
      let roomData = localStorage.getItem(`debate_room_${roomIdToJoin}`);
      
      // If not found in localStorage, try connecting to the room channel directly
      // This will work if the room exists on another client
      const roomChannel = supabase.channel(`debate-room-${roomIdToJoin}`, {
        config: {
          broadcast: { self: false },
          presence: { key: userId },
        },
      });
      
      let joinTimeout: NodeJS.Timeout;
      
      roomChannel
        .on('broadcast', { event: 'room-info' }, (payload) => {
          console.log('Received room info:', payload);
          if (payload && payload.payload && payload.payload.topic) {
            // Clear the timeout since we received a response
            if (joinTimeout) {
              clearTimeout(joinTimeout);
            }
            
            // Set room properties
            setRoomId(roomIdToJoin);
            setTopic(payload.payload.topic);
            setIsRoomActive(true);
            setIsRoomHost(false);
            
            // Store room data in localStorage for this user
            const roomDataToStore: DebateRoom = {
              id: roomIdToJoin,
              topic: payload.payload.topic,
              createdBy: payload.payload.createdBy || 'unknown',
              createdAt: payload.payload.createdAt || Date.now(),
              status: 'active'
            };
            localStorage.setItem(`debate_room_${roomIdToJoin}`, JSON.stringify(roomDataToStore));
            localStorage.setItem('current_debate_room_id', roomIdToJoin);
            
            toast({
              title: "Joined Room Successfully",
              description: `Welcome to the debate: "${payload.payload.topic}"`,
            });
            
            // Clean up
            roomChannel.unsubscribe();
            setIsLoading(false);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to room channel, requesting room info');
            // Request room info
            await roomChannel.send({
              type: 'broadcast',
              event: 'request-room-info',
              payload: { userId: userId, userName: userName },
            });
            
            // If we already have the room data in localStorage, use that
            if (roomData) {
              console.log('Found room data in localStorage');
              const room: DebateRoom = JSON.parse(roomData);
              
              // Clear the timeout since we found the room
              if (joinTimeout) {
                clearTimeout(joinTimeout);
              }
              
              // Set room properties
              setRoomId(roomIdToJoin);
              setTopic(room.topic);
              setIsRoomActive(true);
              setIsRoomHost(false);
              
              localStorage.setItem('current_debate_room_id', roomIdToJoin);
              
              toast({
                title: "Joined Room Successfully",
                description: `Welcome to the debate: "${room.topic}"`,
              });
              
              // Unsubscribe from this temporary channel as we'll create a proper one when room is active
              roomChannel.unsubscribe();
              setIsLoading(false);
            }
          }
        });
      
      // Set a timeout to handle case where no room info is received
      joinTimeout = setTimeout(() => {
        console.log('Timed out waiting for room info');
        roomChannel.unsubscribe();
        
        toast({
          title: "Room Not Found",
          description: "Could not find the room. Please check the room ID and try again.",
          variant: "destructive",
        });
        
        setIsLoading(false);
      }, 5000); // Wait 5 seconds for room info
      
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Failed to Join",
        description: "Could not join the room. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Handle copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard",
    });
  };

  // Speech recognition for debate messages
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setCurrentMessage(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      return recognition;
    }
    return null;
  };

  const toggleSpeechRecognition = () => {
    // Prevent observers and evaluators from using speech recognition
    if (mySide === 'OBSERVER') {
      toast({
        title: "Speech Recognition Disabled",
        description: "Observers cannot use speech recognition. Switch to FOR or AGAINST to participate.",
        variant: "destructive",
      });
      return;
    }

    if (mySide === 'EVALUATOR') {
      toast({
        title: "Speech Recognition Disabled",
        description: "Evaluators cannot use speech recognition. Switch to FOR or AGAINST to participate.",
        variant: "destructive",
      });
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }

    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak clearly to record your argument.",
      });
    }
  };

  // Select a side in the debate or become an observer/evaluator
  const selectSide = async (side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR') => {
    setMySide(side);
    
    try {
      // Update presence data first
      if (roomChannelRef.current) {
        await roomChannelRef.current.track({
          id: userId,
          name: userName,
          side: side,
          isActive: true,
          lastSeen: Date.now(),
        });
      }
      
      // Then broadcast side selection
      await roomChannelRef.current.send({
        type: 'broadcast',
        event: 'select-side',
        payload: { userId, side, userName },
      });
      
      // Update local users list immediately
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user.id === userId ? { ...user, side } : user
        );
        
        // Update opponent connection status
        const opponents = updatedUsers.filter(u => u.id !== userId && u.side !== null && u.side !== 'OBSERVER' && u.side !== 'EVALUATOR');
        setOpponentConnected(opponents.length > 0);
        
        return updatedUsers;
      });
      
      const sideText = side === 'OBSERVER' ? 'as an observer' : 
                       side === 'EVALUATOR' ? 'as an evaluator' : 
                       `${side} the motion`;
      toast({
        title: "Role Selected",
        description: `You are now ${sideText}`,
      });
    } catch (error) {
      console.error('Error selecting side:', error);
      toast({
        title: "Error",
        description: "Failed to select role. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Force role selection to be visible for testing
  const forceShowRoleSelection = () => {
    setMySide(null);
    toast({
      title: "Role Reset",
      description: "Please select your role again",
    });
  };
  
  // Force refresh participants list
  const refreshParticipants = () => {
    console.log('Manual refresh triggered');
    if (roomChannelRef.current) {
      const state = roomChannelRef.current.presenceState();
      const allUsers = Object.values(state).flat() as any[];
      console.log('Manual participants refresh:', allUsers);
      updateAllUsers(allUsers);
      
      toast({
        title: "Participants Refreshed",
        description: `${allUsers.length} participants in room`,
      });
    } else {
      toast({
        title: "Not Connected",
        description: "No active room connection to refresh",
        variant: "destructive",
      });
    }
  };
  
  // End the debate
  const endDebate = async () => {
    try {
      await roomChannelRef.current.send({
        type: 'broadcast',
        event: 'end-debate',
        payload: { userId, roomId },
      });
      
      handleDebateEnd();
    } catch (error) {
      console.error('Error ending debate:', error);
      toast({
        title: "Error",
        description: "Failed to end debate. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDebateEnd = () => {
    setDebateEnded(true);
    
    // Save the completed debate with proper end timestamp and convert message format
    if (roomId) {
      try {
        const roomData = JSON.parse(localStorage.getItem(`debate_room_${roomId}`) || '{}');
        const roomMessages = JSON.parse(localStorage.getItem(`debate_room_${roomId}_messages`) || '[]');
        
        // Convert DebateMessage format to ChatMessage format for history compatibility
        const convertedMessages = roomMessages.map((msg: DebateMessage) => ({
          id: msg.id,
          senderId: msg.sender,
          senderName: msg.senderName,
          text: msg.message,
          side: msg.side,
          timestamp: new Date(msg.timestamp).toISOString()
        }));
        
        // Get participants from current users
        const participants = users.map(user => ({
          id: user.id,
          name: user.name,
          side: user.side,
          isActive: false, // Mark all as inactive since debate ended
          joinedAt: new Date(roomData.createdAt || Date.now()).toISOString(),
          leftAt: new Date().toISOString(),
          lastSeen: new Date().toISOString()
        }));
        
        const endedAt = new Date().toISOString();
        
        const completedDebateRecord = {
          id: roomId,
          roomId: roomId,
          topic: topic || roomData.topic,
          hostName: userName,
          participants: participants,
          messages: convertedMessages,
          createdAt: new Date(roomData.createdAt || Date.now()).toISOString(),
          endedAt: endedAt,
          status: 'completed' as const,
          winner: undefined, // Could be determined based on logic
          moderatorNotes: undefined,
          tags: ['human-vs-human']
        };
        
        // Update the main room data
        const updatedRoomData = {
          ...roomData,
          status: 'completed',
          endedAt: endedAt,
          participants: participants,
          messages: convertedMessages
        };
        
        // Save to multiple storage systems for compatibility
        localStorage.setItem(`debate_room_${roomId}`, JSON.stringify(updatedRoomData));
        
        // Save to temporary debate history service
        try {
          const { TemporaryDebateHistoryService } = require('@/services/temporaryDebateHistoryService');
          TemporaryDebateHistoryService.initialize();
          TemporaryDebateHistoryService.saveDebate(completedDebateRecord);
          console.log('✅ Debate saved to temporary history service');
        } catch (tempError) {
          console.warn('Failed to save to temporary service:', tempError);
        }
        
        // Also save to enhanced service for backup
        try {
          const { EnhancedDebateHistoryService } = require('@/services/enhancedDebateHistoryService');
          EnhancedDebateHistoryService.saveDebate(completedDebateRecord);
          console.log('✅ Debate saved to enhanced history service');
        } catch (enhancedError) {
          console.warn('Failed to save to enhanced service:', enhancedError);
        }
        
        toast({
          title: "Debate Ended",
          description: "The debate has been completed and saved to history.",
        });
      } catch (error) {
        console.error('Error saving debate completion:', error);
        toast({
          title: "Debate Ended",
          description: "The debate has been completed.",
        });
      }
    } else {
      toast({
        title: "Debate Ended",
        description: "The debate has been completed.",
      });
    }
  };
  
  // Clean up room data
  const cleanupRoom = () => {
    // Original cleanup logic
    localStorage.removeItem('current_debate_room_id');
    localStorage.removeItem('debate_room_data_' + roomId);
    
    // Also clean up video resources
    cleanupVideo();
  };
  
  // Function to handle toggling the camera
  // Toggle camera on/off
  const toggleCamera = async () => {
    if (isCameraOn) {
      // Turn off the camera
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
      setIsCameraOn(false);
      
      // Notify peers that camera is off
      if (roomChannelRef.current) {
        roomChannelRef.current.send({
          type: 'broadcast',
          event: 'camera-off',
          payload: { userId },
        }).catch(err => console.error('Error broadcasting camera off:', err));
      }
    } else {
      try {
        // Request camera and microphone permissions using our utility function
        const mediaStream = await getUserMedia({ 
          video: true,
          audio: true 
        });
        setStream(mediaStream);
        setIsCameraOn(true);
        
        // Set the local video stream
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
        
        // Notify peers that camera is on and start WebRTC connection
        if (roomChannelRef.current) {
          roomChannelRef.current.send({
            type: 'broadcast',
            event: 'camera-on',
            payload: { 
              userId,
              isObserver: mySide === 'OBSERVER'
            },
          }).catch(err => console.error('Error broadcasting camera on:', err));
          
          // Initiate WebRTC connection if we're the room host and not just observing
          if (isRoomHost && mySide !== 'OBSERVER') {
            initiatePeerConnection(mediaStream);
          }
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast({
          title: "Camera Access Error",
          description: "Failed to access your camera. Please check permissions.",
          variant: "destructive",
        });
      }
    }
  };

  // Initialize WebRTC peer connection as initiator (room host)
  const initiatePeerConnection = (mediaStream: MediaStream) => {
    // Create a new peer connection using our wrapper
    const peer = createPeerConnection({
      initiator: true,
      trickle: true, // Enable trickle ICE for better connection establishment
      stream: mediaStream
    });
    
    // Handle signals
    peer.on('signal', data => {
      console.log('Generated signal (initiator):', data);
      
      // Send the appropriate signal type to remote peer
      if (roomChannelRef.current) {
        if (data.type === 'offer') {
          roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-offer',
            payload: { 
              userId,
              offer: data
            },
          }).catch(err => console.error('Error sending offer:', err));
        } else if (data.type === 'answer') {
          roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-answer',
            payload: { 
              userId,
              answer: data
            },
          }).catch(err => console.error('Error sending answer:', err));
        } else {
          // For ICE candidates and other signal types
          roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-signal',
            payload: { 
              userId,
              signal: data
            },
          }).catch(err => console.error('Error sending WebRTC signal:', err));
        }
      }
    });
    
    // When we receive a remote stream
    peer.on('stream', stream => {
      console.log('Received remote stream');
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      
      toast({
        title: "Video Connected",
        description: "Remote participant video connected successfully.",
      });
    });
    
    // Handle connection status
    peer.on('connect', () => {
      console.log('WebRTC peer connection established');
      toast({
        title: "Connection Established",
        description: "Video connection established with remote participant.",
      });
    });
    
    // Handle errors
    peer.on('error', err => {
      console.error('Peer connection error:', err);
      toast({
        title: "Connection Error",
        description: "Video connection error. Try turning camera off and on again.",
        variant: "destructive",
      });
    });
    
    // Store the peer reference
    peerRef.current = peer;
  };

  // Handle received WebRTC offer (non-initiator)
  const handleReceivedOffer = (offer: any) => {
    console.log('Handling received offer:', offer);
    if (!stream) {
      console.log('No local stream available. Need to request camera access first.');
      setVideoOffer(offer); // Store the offer to use once we have the stream
      // Auto-enable camera to respond to the offer
      toggleCamera();
      return;
    }
    
    // Create a new peer connection using our wrapper
    const peer = createPeerConnection({
      initiator: false,
      trickle: true, // Enable trickle ICE for better connection establishment
      stream: stream
    });
    
    // Handle signals (answer)
    peer.on('signal', data => {
      console.log('Generated signal (non-initiator):', data);
      
      // Send the appropriate signal type
      if (roomChannelRef.current) {
        if (data.type === 'answer') {
          roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-answer',
            payload: { 
              userId,
              answer: data
            },
          }).catch(err => console.error('Error sending answer:', err));
        } else {
          // For ICE candidates and other signal types
          roomChannelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-signal',
            payload: { 
              userId,
              signal: data
            },
          }).catch(err => console.error('Error sending WebRTC signal:', err));
        }
      }
    });
    
    // When we receive a remote stream
    peer.on('stream', stream => {
      console.log('Received remote stream');
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      
      toast({
        title: "Video Connected",
        description: "Remote participant video connected successfully.",
      });
    });
    
    // Handle connection status
    peer.on('connect', () => {
      console.log('WebRTC peer connection established');
      toast({
        title: "Connection Established",
        description: "Video connection established with remote participant.",
      });
    });
    
    // Handle errors
    peer.on('error', err => {
      console.error('Peer connection error:', err);
      toast({
        title: "Connection Error",
        description: "Video connection error. Try turning camera off and on again.",
        variant: "destructive",
      });
    });
    
    // Signal with the received offer
    peer.signal(offer);
    
    // Store the peer reference
    peerRef.current = peer;
  };

  // Handle received WebRTC answer (initiator)
  const handleReceivedAnswer = (answer: any) => {
    console.log('Handling received answer:', answer);
    if (peerRef.current) {
      peerRef.current.signal(answer);
    } else {
      console.error('No peer connection to signal with answer');
    }
  };

  // Handle ICE candidates
  const handleIceCandidate = (candidate: any) => {
    console.log('Handling ICE candidate:', candidate);
    if (peerRef.current) {
      peerRef.current.signal(candidate);
    } else {
      console.error('No peer connection to signal with ICE candidate');
    }
  };

  // Clean up video streams and connections
  const cleanupVideo = () => {
    // Stop local stream tracks
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    
    // Clean up peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    setIsCameraOn(false);
    setRemoteStream(null);
  };

  const leaveRoom = () => {
    // Unsubscribe from real-time channels
    if (roomChannelRef.current) {
      roomChannelRef.current.unsubscribe();
    }
    
    // Clean up video streams and WebRTC connections
    cleanupVideo();
    
    // If host, clean up room data
    if (isRoomHost) {
      cleanupRoom();
    }
    
    // Navigate back
    onBack();
  };

  // Room creation/join UI
  if (!isRoomActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold mb-2">🎯 Human vs Human Debate</CardTitle>
            <p className="text-blue-100 text-lg">Engage in real-time debates with other participants</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-3">
                {onViewHistory && (
                  <Button variant="outline" onClick={onViewHistory} size="sm" className="flex items-center gap-2">
                    📚 View History
                  </Button>
                )}
                <Button variant="outline" onClick={onBack} size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>

            {/* Create/Join Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <Button 
                variant={isCreatingRoom ? "default" : "ghost"} 
                onClick={() => setIsCreatingRoom(true)}
                className="flex-1 rounded-md"
              >
                🏗️ Create Room
              </Button>
              <Button 
                variant={!isCreatingRoom ? "default" : "ghost"} 
                onClick={() => setIsCreatingRoom(false)}
                className="flex-1 rounded-md"
              >
                🚪 Join Room
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* User Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Your Display Name</label>
                <Input 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder="Enter your name (e.g., John Doe)" 
                  className="h-12 text-lg"
                />
              </div>

              {isCreatingRoom ? (
                <div className="space-y-6">
                  {/* Room ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Room ID (Share with participants)</label>
                    <div className="flex gap-3">
                      <Input value={roomId} disabled className="flex-1 h-12 text-lg font-mono tracking-wider" />
                      <Button 
                        variant="outline" 
                        onClick={() => setRoomId(generateRoomId())} 
                        title="Generate new room ID"
                        className="px-4"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(roomId);
                          toast({ title: "Room ID copied to clipboard!" });
                        }}
                        title="Copy room ID"
                        className="px-4"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Debate Topic */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Debate Topic</label>
                    <Textarea 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)} 
                      placeholder="Enter a clear debate topic (e.g., Should AI replace human teachers in education?)" 
                      className="min-h-[100px] text-lg"
                    />
                  </div>
                  
                  {/* Create Button */}
                  <Button 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                    onClick={createRoom} 
                    disabled={isLoading || !userName.trim() || !topic.trim()}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Creating Room...
                      </>
                    ) : (
                      <>
                        🚀 Create Debate Room
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Join Room ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Enter Room ID</label>
                    <Input 
                      value={joinRoomId} 
                      onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())} 
                      placeholder="Enter 6-character room ID (e.g., ABC123)" 
                      maxLength={6}
                      className="h-12 text-lg font-mono tracking-wider text-center"
                    />
                  </div>
                  
                  {/* Join Button */}
                  <Button 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                    onClick={joinRoom}
                    disabled={isLoading || !userName.trim() || joinRoomId.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Joining Room...
                      </>
                    ) : (
                      <>
                        🎯 Join Debate Room
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Create Room:</strong> Set up a debate topic and share the room ID</li>
                <li>• <strong>Join Room:</strong> Enter a room ID to participate in existing debates</li>
                <li>• <strong>Choose Role:</strong> Select FOR, AGAINST, OBSERVER, or EVALUATOR</li>
                <li>• <strong>Real-time:</strong> Chat and video with other participants</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  // End of Room creation/join UI block

  // Active debate room UI
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header with room info */}
      <div className="bg-primary bg-opacity-10 p-3 border-b shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-lg truncate">{topic || "Debate Room"}</h2>
              <Badge variant="outline" className="ml-2 shrink-0">Room: {roomId}</Badge>
              <Button variant="ghost" size="sm" onClick={copyRoomId} className="h-6 p-1 ml-1 shrink-0" title="Copy Room ID">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground flex items-center space-x-2 flex-wrap">
              <span className="shrink-0">{users.length} participant{users.length !== 1 ? 's' : ''}</span>
              <Badge variant={opponentConnected ? "default" : "outline"} className={opponentConnected ? "bg-green-100 text-green-800 shrink-0" : "shrink-0"}>
                {opponentConnected ? "Opponent Connected" : "Waiting for Opponent"}
              </Badge>
              {users.filter(u => u.side === 'OBSERVER').length > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center shrink-0">
                  <Eye className="h-3 w-3 mr-1" />
                  {users.filter(u => u.side === 'OBSERVER').length} Observer{users.filter(u => u.side === 'OBSERVER').length !== 1 ? 's' : ''}
                </Badge>
              )}
              {users.filter(u => u.side === 'EVALUATOR').length > 0 && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-center shrink-0">
                  ⚖️ {users.filter(u => u.side === 'EVALUATOR').length} Evaluator{users.filter(u => u.side === 'EVALUATOR').length !== 1 ? 's' : ''}
                </Badge>
              )}
              {isRoomHost && <Badge variant="secondary" className="shrink-0">Room Host</Badge>}
            </div>
            
            {/* Display all users in room for debugging */}
            <div className="text-xs text-muted-foreground mt-1 truncate">
              Users in room: {users.map(u => u.name).join(', ')}
            </div>
          </div>
          <div className="flex space-x-2 shrink-0 ml-4">
            {onViewHistory && (
              <Button variant="outline" size="sm" onClick={onViewHistory} className="hidden sm:flex">
                📚 History
              </Button>
            )}
            <Button 
              variant={isCameraOn ? "default" : "outline"} 
              size="sm" 
              onClick={() => toggleCamera()} 
              className="h-8"
              title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isCameraOn ? (
                <>
                  <CameraOff className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Camera Off</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Camera On</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              title="Refresh Participants"
              onClick={refreshParticipants}
              className="hidden sm:flex"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {!debateEnded && (
              <Button variant="destructive" size="sm" onClick={endDebate} className="hidden sm:flex">
                End Debate
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={forceShowRoleSelection} className="hidden md:flex">
              Reset Role
            </Button>
            <Button variant="outline" size="sm" onClick={leaveRoom}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - responsive layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Participants sidebar - responsive */}
        <div className="lg:w-80 lg:border-r bg-white border-b lg:border-b-0 flex-shrink-0">
          <div className="h-full overflow-y-auto p-3 max-h-64 lg:max-h-none">
            {/* Debug info for role selection */}
            <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
            <p>mySide: {mySide || 'null'}</p>
            <p>debateEnded: {debateEnded ? 'true' : 'false'}</p>
            <p>Should show role selection: {(!mySide && !debateEnded) ? 'YES' : 'NO'}</p>
          </div>
          
          {/* Role Selection - Show prominently if no role selected */}
          {!mySide && !debateEnded && (
            <Card className="mb-4 border-2 border-yellow-400 bg-yellow-50 shadow-lg">
              <CardContent className="p-4">
                <h4 className="font-bold mb-3 text-yellow-800 text-center">🎭 Choose Your Role</h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 font-medium py-3"
                    onClick={() => selectSide('FOR')}
                  >
                    <div className="text-center">
                      <div className="text-lg">✅</div>
                      <div className="text-xs">FOR</div>
                    </div>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700 font-medium py-3"
                    onClick={() => selectSide('AGAINST')}
                  >
                    <div className="text-center">
                      <div className="text-lg">❌</div>
                      <div className="text-xs">AGAINST</div>
                    </div>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 font-medium py-3"
                    onClick={() => selectSide('OBSERVER')}
                  >
                    <div className="text-center">
                      <div className="text-lg">👁️</div>
                      <div className="text-xs">Observer</div>
                    </div>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-700 font-medium py-3"
                    onClick={() => selectSide('EVALUATOR')}
                  >
                    <div className="text-center">
                      <div className="text-lg">⚖️</div>
                      <div className="text-xs">Evaluator</div>
                    </div>
                  </Button>
                </div>
                <p className="text-xs text-yellow-600 mt-3 text-center">
                  Choose how you want to participate in this debate
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Current Role Display and Change Option */}
          {mySide && !debateEnded && (
            <Card className="mb-4 border border-gray-200">
              <CardContent className="p-3">
                <h4 className="font-medium mb-2">Your Current Role</h4>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={
                      mySide === 'FOR' 
                        ? 'bg-green-100 text-green-800' 
                        : mySide === 'AGAINST' 
                        ? 'bg-red-100 text-red-800'
                        : mySide === 'OBSERVER'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }
                  >
                    {mySide === 'FOR' && '✅ FOR'}
                    {mySide === 'AGAINST' && '❌ AGAINST'}  
                    {mySide === 'OBSERVER' && '👁️ Observer'}
                    {mySide === 'EVALUATOR' && '⚖️ Evaluator'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs"
                    onClick={() => setMySide(null)}
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold flex items-center">
                <Users className="h-4 w-4 mr-2" /> Participants
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={refreshParticipants}
                title="Refresh Participants"
              >
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Room Info Summary */}
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Room:</span>
                    <span className="font-mono">{roomId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Topic:</span>
                    <span className="text-right ml-2 flex-1 break-words">
                      {topic || 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Users:</span>
                    <span>{users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Your Role:</span>
                    <span className={`font-medium ${
                      mySide === 'FOR' ? 'text-green-600' :
                      mySide === 'AGAINST' ? 'text-red-600' :
                      mySide === 'OBSERVER' ? 'text-blue-600' :
                      mySide === 'EVALUATOR' ? 'text-purple-600' :
                      'text-gray-500'
                    }`}>
                      {mySide || 'Not Selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2 pt-1 border-t">
                    <span>🥊 {users.filter(u => u.side === 'FOR' || u.side === 'AGAINST').length}</span>
                    <span>👁️ {users.filter(u => u.side === 'OBSERVER').length}</span>
                    <span>⚖️ {users.filter(u => u.side === 'EVALUATOR').length}</span>
                    <span className={opponentConnected ? 'text-green-600' : 'text-orange-600'}>
                      {opponentConnected ? '🔗 Connected' : '⏳ Waiting'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Debaters Section */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center">
                🥊 Active Debaters
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {/* FOR Side */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-2">
                    <h5 className="font-medium text-xs text-green-700 mb-2 text-center">FOR</h5>
                    <div className="space-y-1">
                      {users.filter(u => u.side === 'FOR').map(user => (
                        <div key={user.id} className="flex items-center space-x-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs bg-green-100 text-green-700">
                              {user.name?.substring(0, 2) || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate">{user.name}</span>
                          {user.id === userId && <span className="text-xs text-green-600">•</span>}
                        </div>
                      ))}
                      {users.filter(u => u.side === 'FOR').length === 0 && (
                        <p className="text-xs text-gray-500 text-center">Empty</p>
                      )}
                    </div>
                    {(!mySide || mySide !== 'FOR') && !debateEnded && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2 h-6 text-xs bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                        onClick={() => selectSide('FOR')}
                      >
                        Join
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* AGAINST Side */}
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-2">
                    <h5 className="font-medium text-xs text-red-700 mb-2 text-center">AGAINST</h5>
                    <div className="space-y-1">
                      {users.filter(u => u.side === 'AGAINST').map(user => (
                        <div key={user.id} className="flex items-center space-x-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs bg-red-100 text-red-700">
                              {user.name?.substring(0, 2) || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate">{user.name}</span>
                          {user.id === userId && <span className="text-xs text-red-600">•</span>}
                        </div>
                      ))}
                      {users.filter(u => u.side === 'AGAINST').length === 0 && (
                        <p className="text-xs text-gray-500 text-center">Empty</p>
                      )}
                    </div>
                    {(!mySide || mySide !== 'AGAINST') && !debateEnded && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2 h-6 text-xs bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                        onClick={() => selectSide('AGAINST')}
                      >
                        Join
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Observers & Evaluators Section */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center">
                👥 Audience & Judges
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {/* Observers */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-2">
                    <h5 className="font-medium text-xs text-blue-700 mb-2 text-center flex items-center justify-center">
                      <Eye className="h-3 w-3 mr-1" />
                      Observers
                    </h5>
                    <div className="space-y-1">
                      {users.filter(u => u.side === 'OBSERVER').map(user => (
                        <div key={user.id} className="flex items-center space-x-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {user.name?.substring(0, 2) || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate">{user.name}</span>
                          {user.id === userId && <span className="text-xs text-blue-600">•</span>}
                        </div>
                      ))}
                      {users.filter(u => u.side === 'OBSERVER').length === 0 && (
                        <p className="text-xs text-gray-500 text-center">None</p>
                      )}
                    </div>
                    {!mySide && !debateEnded && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2 h-6 text-xs bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700"
                        onClick={() => selectSide('OBSERVER')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Evaluators */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-2">
                    <h5 className="font-medium text-xs text-purple-700 mb-2 text-center">
                      ⚖️ Evaluators
                    </h5>
                    <div className="space-y-1">
                      {users.filter(u => u.side === 'EVALUATOR').map(user => (
                        <div key={user.id} className="flex items-center space-x-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                              {user.name?.substring(0, 2) || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate">{user.name}</span>
                          {user.id === userId && <span className="text-xs text-purple-600">•</span>}
                        </div>
                      ))}
                      {users.filter(u => u.side === 'EVALUATOR').length === 0 && (
                        <p className="text-xs text-gray-500 text-center">None</p>
                      )}
                    </div>
                    {!mySide && !debateEnded && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2 h-6 text-xs bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700"
                        onClick={() => selectSide('EVALUATOR')}
                      >
                        ⚖️ Judge
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {/* Messages area - main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video area */}
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Local video */}
              {isCameraOn && stream ? (
                <div className="relative">
                  <video 
                    ref={myVideoRef}
                    autoPlay 
                    playsInline
                    muted 
                    className="w-48 lg:w-64 h-36 lg:h-48 rounded-md border-2 border-primary shadow-md object-cover" 
                  />
                  <Badge className="absolute top-2 left-2 bg-primary bg-opacity-70 flex items-center text-xs">
                    Me ({mySide === 'OBSERVER' ? (
                      <span className="flex items-center ml-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Observer
                      </span>
                    ) : mySide === 'EVALUATOR' ? (
                      <span className="flex items-center ml-1">
                        ⚖️ Evaluator
                      </span>
                    ) : mySide || 'No Role'})
                  </Badge>
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0 rounded-full bg-white bg-opacity-80 hover:bg-white"
                      onClick={() => toggleCamera()}
                    >
                      {isCameraOn ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-48 lg:w-64 h-36 lg:h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center p-4">
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Your camera is off</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => toggleCamera()}
                    >
                      Turn Camera On
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Remote video */}
              {remoteStream ? (
                <div className="relative">
                  <video 
                    ref={remoteVideoRef}
                    autoPlay 
                    playsInline
                    className="w-48 lg:w-64 h-36 lg:h-48 rounded-md border-2 border-secondary shadow-md object-cover" 
                  />
                  <Badge className="absolute top-2 left-2 bg-secondary bg-opacity-70 text-xs">Opponent</Badge>
                </div>
              ) : opponentConnected ? (
                <div className="flex items-center justify-center w-48 lg:w-64 h-36 lg:h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center p-4">
                    <CameraOff className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Opponent's camera is off</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-48 lg:w-64 h-36 lg:h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center p-4">
                    <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Waiting for opponent...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Messages container with improved scrolling */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <MessageSquare className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400">
                    Start the debate by sending a message
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`inline-block rounded-lg p-3 max-w-[80%] lg:max-w-[70%] ${
                        msg.side === 'FOR' 
                          ? 'bg-green-100 text-green-900' 
                          : msg.side === 'AGAINST' 
                          ? 'bg-red-100 text-red-900'
                          : msg.side === 'OBSERVER'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-purple-100 text-purple-900'
                      } ${msg.sender === userId ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                    >
                      <p className="text-xs font-medium mb-1 flex items-center">
                        {msg.side === 'OBSERVER' && <Eye className="h-3 w-3 mr-1" />}
                        {msg.side === 'EVALUATOR' && <span className="mr-1">⚖️</span>}
                        {msg.senderName}
                        {msg.side === 'OBSERVER' && ' (Observer)'}
                        {msg.side === 'EVALUATOR' && ' (Evaluator)'}
                      </p>
                      <p className="text-sm lg:text-base break-words">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input area */}
          {debateEnded ? (
            <Card className="p-3 border-t">
              <CardContent className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Debate Completed!</h3>
                <p className="text-gray-600 mb-4">Thanks for participating in this debate.</p>
                <Button onClick={leaveRoom} className="w-full">
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="p-3 border-t">
              {!mySide ? (
                <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-400 mb-2 shadow-md">
                  <p className="text-yellow-800 font-medium mb-3">🎭 Please select your role to participate:</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('FOR')} 
                      className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 font-medium"
                    >
                      ✅ Join FOR
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('AGAINST')} 
                      className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700 font-medium"
                    >
                      ❌ Join AGAINST
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('OBSERVER')} 
                      className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 font-medium"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      👁️ Observe
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('EVALUATOR')} 
                      className="bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-700 font-medium"
                    >
                      ⚖️ Evaluate
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-600 mt-2">Choose FOR/AGAINST to debate, Observer to watch, or Evaluator to assess</p>
                </div>
              ) : mySide === 'OBSERVER' ? (
                <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-300 mb-2">
                  <p className="text-blue-800 font-medium mb-2">👁️ Observer Mode</p>
                  <p className="text-blue-600 text-sm mb-3">
                    You are watching this debate as an observer. You cannot send messages but can watch the discussion unfold.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('FOR')} 
                      className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                    >
                      ✅ Switch to FOR
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('AGAINST')} 
                      className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700"
                    >
                      ❌ Switch to AGAINST
                    </Button>
                  </div>
                </div>
              ) : mySide === 'EVALUATOR' ? (
                <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-300 mb-2">
                  <p className="text-purple-800 font-medium mb-2">⚖️ Evaluator Mode</p>
                  <p className="text-purple-600 text-sm mb-3">
                    You are evaluating this debate. You can send feedback, questions, and assessments to help improve the discussion.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('FOR')} 
                      className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                    >
                      ✅ Switch to FOR
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => selectSide('AGAINST')} 
                      className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700"
                    >
                      ❌ Switch to AGAINST
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your argument..."
                    className="min-h-[80px] resize-none"
                    disabled={false}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <div className="flex space-x-2 justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Press Ctrl+Enter to send
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={isRecording ? "default" : "outline"}
                        size="icon"
                        className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
                        onClick={toggleSpeechRecognition}
                        title={isRecording ? "Stop recording" : "Start recording"}
                        disabled={false}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button 
                        onClick={sendMessage}
                        disabled={false}
                        title="Send message"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanDebateRoom;
