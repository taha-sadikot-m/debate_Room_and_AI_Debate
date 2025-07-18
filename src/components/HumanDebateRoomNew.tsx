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

  // Create room
  const createRoom = async () => {
    if (!userName.trim() || !topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and a debate topic.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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
      }));
      localStorage.setItem('current_debate_room_id', newRoomId);
      localStorage.setItem(`debate_room_${newRoomId}_messages`, JSON.stringify([]));
      
      // Activate the room
      setIsRoomHost(true);
      setIsRoomActive(true);
      console.log(`Room created: ${newRoomId} by ${userName}`);
      
      toast({
        title: "Room Created Successfully!",
        description: `Room ID: ${newRoomId}. Share this ID with participants.`,
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Join room
  const joinRoom = async () => {
    if (!userName.trim() || !joinRoomId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and room ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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
            
            // Register as an opponent
            const opponentData = {
              id: userId,
              name: userName,
              side: null // Don't auto-assign side
            };
            localStorage.setItem(`debate_room_${roomIdToJoin}_opponent`, JSON.stringify(opponentData));
            localStorage.setItem('current_debate_room_id', roomIdToJoin);
            
            toast({
              title: "Joined Room Successfully!",
              description: `Welcome to room ${roomIdToJoin}`,
            });
            
            // Unsubscribe from this temporary channel as we'll create a proper one when room is active
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
              
              // Set room properties
              setRoomId(roomIdToJoin);
              setTopic(room.topic);
              setIsRoomActive(true);
              setIsRoomHost(false);
              
              // Register as an opponent
              const opponentData = {
                id: userId,
                name: userName,
                side: null // Don't auto-assign side
              };
              
              localStorage.setItem(`debate_room_${roomIdToJoin}_opponent`, JSON.stringify(opponentData));
              localStorage.setItem('current_debate_room_id', roomIdToJoin);
              
              toast({
                title: "Joined Room Successfully!",
                description: `Welcome to room ${roomIdToJoin}`,
              });
              
              roomChannel.unsubscribe();
              setIsLoading(false);
              return;
            }
            
            // Set a timeout to check if we received room info
            joinTimeout = setTimeout(() => {
              if (!isRoomActive) {
                console.log('Timed out waiting for room info');
                roomChannel.unsubscribe();
                toast({
                  title: "Room Not Found",
                  description: "The room ID you entered does not exist or is no longer active",
                  variant: "destructive",
                });
                setIsLoading(false);
              }
            }, 3000);
          }
        });
      
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room. Please check the room ID.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Select side
  // Select side
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
        description: `You are now participating ${sideText}`,
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

  // Send message
  const sendMessage = async () => {
    if (!currentMessage.trim() || !mySide || !roomId || !isRoomActive) {
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

    const message: DebateMessage = {
      id: `msg-${uuidv4()}`,
      roomId: roomId,
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
        payload: message,
      });

      // Also add locally for immediate feedback
      addMessage(message);
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

  // Toggle camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraOn(false);
      
      // Notify other users that camera is off
      if (roomChannelRef.current) {
        await roomChannelRef.current.send({
          type: 'broadcast',
          event: 'camera-off',
          payload: { userId, userName },
        });
      }
    } else {
      try {
        const mediaStream = await getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        setIsCameraOn(true);
        
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
        
        // Notify other users that camera is on
        if (roomChannelRef.current) {
          await roomChannelRef.current.send({
            type: 'broadcast',
            event: 'camera-on',
            payload: { userId, userName },
          });
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera Error",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    }
  };

  // Leave room
  const leaveRoom = () => {
    // Unsubscribe from real-time channels
    if (roomChannelRef.current) {
      roomChannelRef.current.unsubscribe();
    }
    
    // Clean up video streams and WebRTC connections
    cleanupVideo();
    
    // If host, clean up room data
    if (isRoomHost) {
      localStorage.removeItem(`debate_room_${roomId}`);
      localStorage.removeItem(`debate_room_${roomId}_host`);
    }
    
    // Clean up common room data
    localStorage.removeItem('current_debate_room_id');
    
    onBack();
  };

  // End debate
  const endDebate = async () => {
    try {
      // Broadcast debate end to all participants
      if (roomChannelRef.current) {
        await roomChannelRef.current.send({
          type: 'broadcast',
          event: 'end-debate',
          payload: { userId, userName },
        });
      }
      
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
      const completedDebate = {
        id: roomId,
        topic: topic,
        endTime: Date.now(),
        messages: messages,
        participants: users,
      };
      
      // Store in debate history
      const existingHistory = JSON.parse(localStorage.getItem('debate_history') || '[]');
      const updatedHistory = [completedDebate, ...existingHistory].slice(0, 50); // Keep last 50 debates
      localStorage.setItem('debate_history', JSON.stringify(updatedHistory));
    } else {
      console.error('No roomId found when ending debate');
    }
    
    toast({
      title: "Debate Ended",
      description: "The debate has been concluded.",
    });
  };

  // Initialize WebRTC peer connection as initiator (room host)
  const initiatePeerConnection = (mediaStream: MediaStream) => {
    // Create a new peer connection using our wrapper
    const peer = createPeerConnection({
      initiator: true,
      trickle: true,
      stream: mediaStream
    });
    
    // Handle signals
    peer.on('signal', data => {
      console.log('Sending WebRTC signal:', data);
      roomChannelRef.current?.send({
        type: 'broadcast',
        event: 'webrtc-offer',
        payload: { userId, offer: data },
      });
    });
    
    // When we receive a remote stream
    peer.on('stream', stream => {
      console.log('Received remote stream');
      setRemoteStream(stream);
    });
    
    // Handle connection status
    peer.on('connect', () => {
      console.log('WebRTC connection established');
      toast({
        title: "Video Connection Established",
        description: "Video call is now active",
      });
    });
    
    // Handle errors
    peer.on('error', err => {
      console.error('WebRTC error:', err);
      toast({
        title: "Video Connection Error",
        description: "Failed to establish video connection",
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
      console.log('No stream available, storing offer for later');
      setVideoOffer(offer);
      return;
    }
    
    // Create a new peer connection using our wrapper
    const peer = createPeerConnection({
      initiator: false,
      trickle: true,
      stream: stream
    });
    
    // Handle signals (answer)
    peer.on('signal', data => {
      console.log('Sending WebRTC answer:', data);
      roomChannelRef.current?.send({
        type: 'broadcast',
        event: 'webrtc-answer',
        payload: { userId, answer: data },
      });
    });
    
    // When we receive a remote stream
    peer.on('stream', stream => {
      console.log('Received remote stream');
      setRemoteStream(stream);
    });
    
    // Handle connection status
    peer.on('connect', () => {
      console.log('WebRTC connection established');
      toast({
        title: "Video Connection Established",
        description: "Video call is now active",
      });
    });
    
    // Handle errors
    peer.on('error', err => {
      console.error('WebRTC error:', err);
      toast({
        title: "Video Connection Error",
        description: "Failed to establish video connection",
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
      console.error('No peer connection found for answer');
    }
  };

  // Handle ICE candidates
  const handleIceCandidate = (candidate: any) => {
    console.log('Handling ICE candidate:', candidate);
    if (peerRef.current) {
      peerRef.current.signal(candidate);
    } else {
      console.error('No peer connection found for ICE candidate');
    }
  };

  // Clean up video streams and connections
  const cleanupVideo = () => {
    // Stop local stream tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
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

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize room
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
        localStorage.removeItem(`debate_room_${roomId}`);
      }
      
      // Make sure to clean up video streams and WebRTC connections
      cleanupVideo();
    }
  }, [isCreatingRoom]);

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

  // Check if there are active videos when the opponent connection changes
  useEffect(() => {
    if (opponentConnected && isCameraOn && stream) {
      // If we're the host, initiate the connection
      if (isRoomHost) {
        initiatePeerConnection(stream);
      }
    }
  }, [opponentConnected, isCameraOn]);
  
  // Check for opponent whenever users list changes
  useEffect(() => {
    checkForOpponent();
  }, [users]);

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
          checkForOpponent();
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          removeUserPresence(leftPresences);
          checkForOpponent();
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
        const matchingNewUser = newUsers.find(newUser => newUser.id === existingUser.id);
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
                        onClick={copyRoomId}
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

  // Active debate room UI
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
      {/* Modern Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Room:</span>
                <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
                  {roomId}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    toast({ title: "Room ID copied!" });
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{users.length} participant{users.length !== 1 ? 's' : ''}</span>
                </div>
                {opponentConnected && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Connected</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCamera()}
                className="hidden sm:flex"
              >
                {isCameraOn ? (
                  <>
                    <Camera className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Camera</span>
                  </>
                ) : (
                  <>
                    <CameraOff className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Camera</span>
                  </>
                )}
              </Button>
              
              {!debateEnded && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={endDebate}
                  className="hidden sm:flex"
                >
                  End Debate
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={leaveRoom}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Exit</span>
              </Button>
            </div>
          </div>
          
          {/* Topic Display */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Debate Topic</h3>
                <p className="text-blue-800 text-sm leading-relaxed">{topic}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Participants & Video */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Participants Section */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participants
            </h4>
            
            {/* Role Selection - Show prominently if no role selected */}
            {!mySide && !debateEnded && (
              <Card className="mb-4 border-2 border-amber-300 bg-amber-50 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-2xl mb-2">🎭</div>
                    <h5 className="font-semibold text-amber-800">Choose Your Role</h5>
                    <p className="text-xs text-amber-700 mt-1">Select how you'd like to participate</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 font-medium h-12 flex flex-col items-center justify-center"
                      onClick={() => selectSide('FOR')}
                    >
                      <span className="text-lg">✅</span>
                      <span className="text-xs">FOR</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700 font-medium h-12 flex flex-col items-center justify-center"
                      onClick={() => selectSide('AGAINST')}
                    >
                      <span className="text-lg">❌</span>
                      <span className="text-xs">AGAINST</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 font-medium h-12 flex flex-col items-center justify-center"
                      onClick={() => selectSide('OBSERVER')}
                    >
                      <span className="text-lg">👁️</span>
                      <span className="text-xs">OBSERVE</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-700 font-medium h-12 flex flex-col items-center justify-center"
                      onClick={() => selectSide('EVALUATOR')}
                    >
                      <span className="text-lg">⚖️</span>
                      <span className="text-xs">EVALUATE</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Current Role Display */}
            {mySide && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Your Role:</span>
                    <Badge variant={mySide === 'FOR' ? 'default' : mySide === 'AGAINST' ? 'destructive' : mySide === 'OBSERVER' ? 'secondary' : 'outline'}>
                      {mySide === 'FOR' ? '✅ FOR' : mySide === 'AGAINST' ? '❌ AGAINST' : mySide === 'OBSERVER' ? '👁️ OBSERVER' : '⚖️ EVALUATOR'}
                    </Badge>
                  </div>
                  {!debateEnded && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setMySide(null)}
                      className="text-xs"
                    >
                      Change
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Participants List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for participants...</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      {user.id === userId && <Badge variant="outline" className="text-xs">You</Badge>}
                    </div>
                    {user.side && (
                      <Badge variant={user.side === 'FOR' ? 'default' : user.side === 'AGAINST' ? 'destructive' : 'secondary'} className="text-xs">
                        {user.side}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Video Section */}
          <div className="flex-1 p-4 space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Video Feed
            </h4>
            
            <div className="space-y-3">
              {/* Local video */}
              {stream ? (
                <div className="relative">
                  <video 
                    ref={myVideoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-32 rounded-lg border border-gray-300 object-cover bg-gray-100" 
                  />
                  <Badge className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs">
                    You ({mySide || 'No Role'})
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white bg-opacity-90"
                    onClick={() => toggleCamera()}
                  >
                    {isCameraOn ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <Camera className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 mb-2">Camera off</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCamera()}
                      className="text-xs"
                    >
                      Turn On
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
                    className="w-full h-32 rounded-lg border border-gray-300 object-cover bg-gray-100" 
                  />
                  <Badge className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs">
                    Participant
                  </Badge>
                </div>
              ) : opponentConnected ? (
                <div className="flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <CameraOff className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Participant's camera off</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Waiting for participants...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Messages Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Start Debating?</h3>
                  <p className="text-gray-600 mb-6">
                    Choose your role and begin the discussion. Share your thoughts, present arguments, and engage with other participants.
                  </p>
                  {!mySide && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-amber-800 font-medium">👆 Select your role in the sidebar to begin participating</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 ${
                      message.side === 'FOR' ? 'bg-green-100 text-green-900' :
                      message.side === 'AGAINST' ? 'bg-red-100 text-red-900' :
                      message.side === 'OBSERVER' ? 'bg-blue-100 text-blue-900' :
                      'bg-purple-100 text-purple-900'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-semibold">
                          {message.side === 'OBSERVER' && '👁️ '}
                          {message.side === 'EVALUATOR' && '⚖️ '}
                          {message.senderName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {message.side}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            {debateEnded ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Debate Complete!</h3>
                <p className="text-gray-600 mb-6">Thank you for participating in this debate.</p>
                <Button onClick={leaveRoom} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Return to Dashboard
                </Button>
              </div>
            ) : !mySide ? (
              <div className="text-center py-6">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">🎭 Choose Your Role to Participate</h4>
                  <p className="text-amber-700 text-sm">Select your role from the sidebar to start sending messages and participating in the debate.</p>
                </div>
              </div>
            ) : mySide === 'OBSERVER' ? (
              <div className="text-center py-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">👁️ Observer Mode</h4>
                  <p className="text-blue-700 text-sm">You are watching this debate as an observer. Switch to FOR or AGAINST to participate in the discussion.</p>
                  <div className="flex justify-center space-x-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => selectSide('FOR')} className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700">
                      ✅ Join FOR
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => selectSide('AGAINST')} className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700">
                      ❌ Join AGAINST
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={mySide === 'FOR' ? 'default' : mySide === 'AGAINST' ? 'destructive' : 'outline'}>
                    {mySide === 'FOR' ? '✅ FOR' : mySide === 'AGAINST' ? '❌ AGAINST' : mySide === 'EVALUATOR' ? '⚖️ EVALUATOR' : mySide}
                  </Badge>
                  <span className="text-sm text-gray-600">Your Position</span>
                </div>
                
                <div className="flex space-x-3">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={
                      mySide === 'FOR' ? "Present your argument supporting the motion..." :
                      mySide === 'AGAINST' ? "Present your argument against the motion..." :
                      mySide === 'EVALUATOR' ? "Provide your evaluation or feedback..." :
                      "Type your message..."
                    }
                    className="flex-1 min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Press Ctrl+Enter to send quickly</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleCamera()}
                      className="flex items-center space-x-1"
                    >
                      {isCameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                      <span className="hidden sm:inline">{isCameraOn ? 'Camera Off' : 'Camera On'}</span>
                    </Button>
                    <Button 
                      onClick={sendMessage}
                      disabled={!currentMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanDebateRoom;
