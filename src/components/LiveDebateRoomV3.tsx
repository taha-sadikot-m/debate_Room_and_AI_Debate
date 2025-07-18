import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Users, Clock, Trophy, Flag, MessageSquare, Zap, Mic, MicOff, Volume2, Send, Bot, Timer, Star, Copy, UserPlus, LogIn, Share2, Link, CheckCircle, Trash } from 'lucide-react';
import { LiveDebateTopic } from '@/data/liveDebateTopics';
import { Topic } from '@/data/topics';
import { useToast } from '@/hooks/use-toast';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
  side?: 'FOR' | 'AGAINST'; // Added side property (optional)
}

interface Team {
  id: string;
  name: string;
  members: OnlineUser[];
  rating: number;
  wins: number;
  losses: number;
}

interface LiveDebateMessage {
  id: string;
  speaker: string;
  team: 'FOR' | 'AGAINST';
  message: string;
  timestamp: Date;
  isUser: boolean;
}

interface LiveDebateRoomV3Props {
  topic: LiveDebateTopic | Topic | null;
  format: '1v1' | '3v3';
  opponent?: OnlineUser;
  team?: Team;
  language: string;
  onBack: () => void;
  onComplete: (result: any) => void;
  roomId?: string; // Added roomId prop
}

const LiveDebateRoomV3 = ({ 
  topic, 
  format, 
  opponent, 
  team, 
  language,
  onBack, 
  onComplete,
  roomId // Destructure roomId prop
}: LiveDebateRoomV3Props) => {
  // Helper functions to handle different topic types
  function getTopicTimeEstimate(topic: LiveDebateTopic | Topic | null): string {
    if (!topic) return '15-20 min';
    if ('time_estimate' in topic) return topic.time_estimate;
    if ('timeEstimate' in topic) return topic.timeEstimate;
    return '15-20 min';
  }

  function getTopicDifficulty(topic: LiveDebateTopic | Topic | null): string {
    if (!topic) return 'Medium';
    return topic.difficulty || 'Medium';
  }

  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'active' | 'complete'>('waiting');
  const [timeUntilStart, setTimeUntilStart] = useState(10);
  const [assignedSide, setAssignedSide] = useState<'FOR' | 'AGAINST'>('FOR');
  const [messages, setMessages] = useState<LiveDebateMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTime, setSpeakingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(format === '1v1' ? 3 : 6);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [debateResult, setDebateResult] = useState<any>(null);
  const [realOpponent, setRealOpponent] = useState<OnlineUser | null>(null);
  
  // Room Status
  const [isRoomHost, setIsRoomHost] = useState<boolean>(!!roomId);
  // Get existing room ID from localStorage or use the provided roomId prop
  const [currentRoomId, setRoomId] = useState<string>(() => {
    // First clear any existing room data to prevent issues
    localStorage.removeItem('current_debate_room_id');
    
    // If roomId prop is provided, use it
    if (roomId) {
      console.log("Room ID provided via props:", roomId);
      return roomId;
    }
    
    // Otherwise start with empty string
    return '';
  });
  
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'connected' | 'error'>('connected');
  
  // Additional state variables for dialogs
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [waitingForOpponent, setWaitingForOpponent] = useState(roomId ? true : false);
  
  // State for tracking end debate requests
  const [endDebateRequested, setEndDebateRequested] = useState<string>('none');

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Display room status, ID, and opponent information
  const renderRoomStatus = () => {
    // Show room creation/joining buttons if there's no active room
    if (!currentRoomId && roomStatus !== 'connected') {
      return (
        <Card className="mb-4 border-dashed border-blue-300 bg-blue-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">Live Debate Room</h3>
            </div>
            
            <div className="text-sm text-blue-700 mb-4">
              Create a debate room and invite an opponent, or join an existing room.
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={handleCreateRoom}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
              
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => {
                  setIsJoinDialogOpen(true);
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Show active room information
    return (
      <Card className="mb-4 border-dashed border-yellow-300 bg-yellow-50">
        <CardContent className="pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-800">
                {isRoomHost ? 'Your Room' : 'Joined Room'}
              </h3>
            </div>
            <Badge 
              variant={roomStatus === 'connected' ? 'default' : 'outline'}
              className={roomStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
            >
              {roomStatus === 'connected' ? 'Opponent Connected' : 'Waiting for opponent...'}
            </Badge>
          </div>
          
          {roomStatus === 'waiting' && currentRoomId && (
            <div className="text-sm text-yellow-600 mb-2">
              Share this Room ID with your opponent: <span className="font-mono font-bold">{currentRoomId}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 ml-2" 
                onClick={copyRoomId}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}

          {roomStatus === 'connected' && realOpponent ? (
            <div className="flex items-center justify-between mt-2 p-2 bg-white rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {realOpponent.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{realOpponent.name}</div>
                  <div className="text-xs text-gray-500">{realOpponent.level} • {realOpponent.country}</div>
                </div>
              </div>
              <Badge variant="outline" className="ml-auto">
                {assignedSide === 'FOR' ? 'AGAINST' : 'FOR'}
              </Badge>
            </div>
          ) : roomStatus === 'connected' ? (
            <div className="text-sm text-blue-600 mb-2">
              No opponent connected yet. You can create a room or join an existing room.
            </div>
          ) : null}

          {/* Add button to invite opponents if still waiting */}
          {roomStatus === 'waiting' && currentRoomId && (
            <div className="flex flex-col gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Opponent
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  // Clear room data
                  localStorage.removeItem('current_debate_room_id');
                  localStorage.removeItem(`debate_room_${currentRoomId}_host`);
                  localStorage.removeItem(`debate_room_${currentRoomId}_opponent`);
                  localStorage.removeItem(`debate_room_${currentRoomId}_messages`);
                  localStorage.removeItem(`debate_room_${currentRoomId}_end_requested`);
                  localStorage.removeItem(`debate_room_${currentRoomId}_end_approved`);
                  setRoomId('');
                  setIsRoomHost(false);
                  setRoomStatus('connected');
                  setWaitingForOpponent(false);
                  
                  toast({
                    title: "Room Cleared",
                    description: "You can now create a new room or join another one.",
                  });
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear Room Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Handle real opponent joining
  const handleRealOpponentJoined = (opponent: OnlineUser) => {
    setRealOpponent(opponent);
    setRoomStatus('connected');
    setWaitingForOpponent(false);
    
    toast({
      title: "Opponent Joined!",
      description: `${opponent.name} has joined the debate.`,
    });
  };
  
  // Function to copy room ID to clipboard
  const copyRoomId = () => {
    if (currentRoomId) {
      navigator.clipboard.writeText(currentRoomId);
      toast({
        title: "Room ID Copied",
        description: "Room ID has been copied to your clipboard",
      });
    }
  };

  // Generate room ID (this would be a server-side function in a real app)
  const generateRoomId = () => {
    // Generate a 6-character room ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Function to create a new room as host
  const handleCreateRoom = () => {
    // Clear any existing room data first
    if (currentRoomId) {
      localStorage.removeItem(`debate_room_${currentRoomId}_host`);
      localStorage.removeItem(`debate_room_${currentRoomId}_opponent`);
      localStorage.removeItem(`debate_room_${currentRoomId}_messages`);
      localStorage.removeItem(`debate_room_${currentRoomId}_end_requested`);
      localStorage.removeItem(`debate_room_${currentRoomId}_end_approved`);
    }
    
    // Generate room ID when creating a room
    const newRoomId = generateRoomId();
    console.log("Generated new room ID:", newRoomId);
    
    // Create host user data with a more recognizable name
    const hostUser: OnlineUser = {
      id: `host-${Math.floor(Math.random() * 1000)}`,
      name: `Host-${Math.floor(Math.random() * 100)}`,
      level: 'Advanced',
      tokens: 500,
      country: 'Global',
      status: 'available',
      side: assignedSide // Store which side the host is on
    };
    
    console.log("Host user data:", hostUser);
    
    // Store host data in localStorage for joining users to find
    localStorage.setItem(`debate_room_${newRoomId}_host`, JSON.stringify(hostUser));
    
    // Update component state
    setRoomId(newRoomId);
    setIsRoomHost(true);
    setRoomStatus('waiting');
    setWaitingForOpponent(true);
    setRealOpponent(null);
    
    // Show invite dialog with room ID
    setIsInviteDialogOpen(true);
    
    // Start polling for opponent joining
    const checkInterval = setInterval(() => {
      if (!currentRoomId) {
        clearInterval(checkInterval);
        return;
      }
      
      const opponentData = localStorage.getItem(`debate_room_${newRoomId}_opponent`);
      console.log("Checking for opponent data:", opponentData);
      
      if (opponentData) {
        try {
          const opponent = JSON.parse(opponentData);
          console.log("Opponent joined:", opponent);
          
          setRealOpponent(opponent);
          setRoomStatus('connected');
          setWaitingForOpponent(false);
          clearInterval(checkInterval);
          
          // Notify that opponent has joined
          toast({
            title: "Opponent Joined!",
            description: `${opponent.name} has joined the debate.`,
          });
          
          // Set phase to active and initialize the debate
          setCurrentPhase('active');
          initializeDebate();
        } catch (e) {
          console.error("Failed to parse opponent data", e);
        }
      }
    }, 1000);
    
    // Show confirmation toast that room was created
    toast({
      title: "Room Created Successfully",
      description: `Your room ID is: ${newRoomId}. Waiting for opponent to join.`,
    });
  };
  
  // Function to handle joining a room
  const handleJoinRoom = () => {
    console.log("Join room clicked with code:", joinRoomId);
    
    if (!joinRoomId || joinRoomId.length < 6) {
      toast({
        title: "Invalid Room Code",
        description: "Please enter a valid 6-character room code",
        variant: "destructive"
      });
      return;
    }
    
    // First check if the room exists by looking for the host data
    const hostData = localStorage.getItem(`debate_room_${joinRoomId}_host`);
    if (!hostData) {
      toast({
        title: "Room Not Found",
        description: "No debate room found with that code. Please verify and try again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("Found room, host data:", hostData);
      
      // Generate user data for the joining user
      const currentUser: OnlineUser = {
        id: `user-${Math.floor(Math.random() * 1000)}`,
        name: `Guest-${Math.floor(Math.random() * 100)}`,
        level: 'Intermediate',
        tokens: Math.floor(Math.random() * 500),
        country: 'Global',
        status: 'available',
        side: 'FOR'
      };
      
      // Parse the host data
      const hostUser: OnlineUser = JSON.parse(hostData);
      console.log("Parsed host user:", hostUser);
      
      // Set opponent side opposite to host
      currentUser.side = hostUser.side === 'FOR' ? 'AGAINST' : 'FOR';
      console.log("Assigned side:", currentUser.side);
      
      // Store user data in local storage for the host to find
      localStorage.setItem(`debate_room_${joinRoomId}_opponent`, JSON.stringify(currentUser));
      
      // Set opponent (the host)
      setRealOpponent(hostUser);
      
      // Set room ID and update state
      localStorage.setItem('current_debate_room_id', joinRoomId);
      setRoomId(joinRoomId);
      setIsRoomHost(false);
      setIsJoinDialogOpen(false);
      setRoomStatus('connected');
      setCurrentPhase('active');
      setAssignedSide(currentUser.side);
      
      // Explicitly set isMyTurn to true so the message box is enabled for the joining user
      setIsMyTurn(true);
      setCurrentSpeaker('You');
      
      toast({
        title: "Room Joined Successfully",
        description: `You've joined ${hostUser.name}'s debate room. You are arguing ${currentUser.side}.`,
        variant: "default"
      });
      
      // Initialize the debate with a proper welcome message
      const initialMessage: LiveDebateMessage = {
        id: `msg-${Date.now()}`,
        speaker: 'System',
        team: 'FOR', // Using FOR as default for system messages
        message: `Welcome to the debate! The topic is: ${topic?.title || 'Unknown Topic'}. You are on the ${currentUser.side} side.`,
        timestamp: new Date(),
        isUser: false
      };
      
      setMessages([initialMessage]);
      
      // Store the welcome message in localStorage for the host to see
      localStorage.setItem(`debate_room_${joinRoomId}_messages`, JSON.stringify([initialMessage]));
      
      // Start checking for messages from host
      checkForOpponentResponse();
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Error Joining Room",
        description: "There was a problem joining the room. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Use effect for redirection when topic is missing
  useEffect(() => {
    if (!topic) {
      console.error('No topic selected for live debate, redirecting to selection');
      const timer = setTimeout(() => {
        onBack();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [topic, onBack]);

  // Setup side assignment
  useEffect(() => {
    // Randomly assign side only if it's not already set by joining a room
    if (!roomId) {
      setAssignedSide(Math.random() > 0.5 ? 'FOR' : 'AGAINST');
    }
  }, [roomId]);

  // Effect to start checking for end debate requests when in a room with a real opponent
  useEffect(() => {
    if (realOpponent && currentPhase === 'active' && currentRoomId) {
      const cleanup = checkForEndDebateRequests();
      return cleanup;
    }
  }, [realOpponent, currentPhase, currentRoomId]);

  // Render invite and join dialogs
  const renderDialogs = () => {
    return (
      <>
        {/* Invite Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Debate Opponent</DialogTitle>
              <DialogDescription>
                Share this room code with someone to invite them to join this debate.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center justify-center p-6">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-2">Room Code</p>
                <div className="text-3xl font-bold tracking-wider">{currentRoomId}</div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button className="w-full" onClick={copyRoomId}>
                <Copy className="h-4 w-4 mr-2" /> Copy Room Code
              </Button>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => {
                  // We already created the room in handleCreateRoom, just close the dialog
                  setIsInviteDialogOpen(false);
                  toast({
                    title: "Room Created",
                    description: `Room ${currentRoomId} is ready for opponents to join`,
                  });
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Join Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a Debate</DialogTitle>
              <DialogDescription>
                Enter the room code shared with you to join a live debate.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Code</label>
                <Input 
                  placeholder="Enter 6-digit code" 
                  value={joinRoomId} 
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())} 
                  className="text-center text-lg"
                  maxLength={6}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button className="w-full" onClick={handleJoinRoom}>
                Join Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  // Manual start debate function
  const handleStartDebate = () => {
    // For host, check if there's an opponent before allowing debate to start
    if (isRoomHost && currentRoomId && roomStatus === 'waiting' && !realOpponent) {
      toast({
        title: "Waiting for Opponent",
        description: "Please wait for an opponent to join before starting the debate",
        variant: "destructive"
      });
      return;
    }
    
    // Change phase to active
    setCurrentPhase('active');
    
    // Initialize the debate properly
    initializeDebate();
    
    // If there's no real opponent, we need to set isMyTurn
    if (!realOpponent) {
      setIsMyTurn(true);
    }
    
    // Show toast notification
    toast({
      title: "Debate Started!",
      description: `You are arguing ${assignedSide}. Good luck!`,
    });
  };

  // Timer for speaking time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking && currentPhase === 'active') {
      interval = setInterval(() => {
        setSpeakingTime(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, currentPhase]);

  const initializeDebate = () => {
    // When a room is created, the host should speak first
    // For joiner, we've already set isMyTurn to true in handleJoinRoom
    if (isRoomHost) {
      setIsMyTurn(true);
      setCurrentSpeaker('You');
    }
    
    // For real opponents, make sure the messages array is initialized correctly
    if (realOpponent && currentRoomId) {
      // Check if there are already messages in localStorage
      const existingMessages = JSON.parse(localStorage.getItem(`debate_room_${currentRoomId}_messages`) || '[]');
      if (existingMessages.length > 0) {
        setMessages(existingMessages);
      }
    }
    
    // Show a toast notification
    toast({
      title: "Debate Started!",
      description: `You are arguing ${assignedSide}. ${isMyTurn ? 'You speak first' : 'Your opponent speaks first'}.`,
    });
    
    // Add initial welcome message if there are no messages yet and we don't have messages from localStorage
    if (messages.length === 0) {
      const initialMessage: LiveDebateMessage = {
        id: `msg-${Date.now()}`,
        speaker: 'System',
        team: 'FOR', // Using FOR as default for system messages
        message: `The debate has begun! The topic is: ${topic?.title || 'Unknown Topic'}. ${isMyTurn ? 'You' : 'Your opponent'} speaks first.`,
        timestamp: new Date(),
        isUser: false
      };
      
      setMessages([initialMessage]);
      
      // For real opponents, store this in localStorage too
      if (realOpponent && currentRoomId) {
        localStorage.setItem(`debate_room_${currentRoomId}_messages`, JSON.stringify([initialMessage]));
      }
    }
  };

  const generateOpponentResponse = async (userMessage: string, context: LiveDebateMessage[]) => {
    // Check if we have a real opponent first
    if (realOpponent) {
      // If we have a real opponent, we'd usually wait for their response
      // For now, we'll simulate a waiting period and then return a placeholder
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const opposingSide: 'FOR' | 'AGAINST' = assignedSide === 'FOR' ? 'AGAINST' : 'FOR';
      
      // This is just a placeholder. In a real implementation, you would:
      // 1. Send the user's message to a server
      // 2. Wait for the real opponent to respond
      // 3. Receive their response and display it
      return {
        id: Date.now().toString(),
        speaker: realOpponent.name,
        team: opposingSide,
        message: `[Waiting for ${realOpponent.name}'s response...]`,
        timestamp: new Date(),
        isUser: false
      } as LiveDebateMessage;
    }
    
    // Original AI opponent logic for when there's no real opponent
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const opposingSide: 'FOR' | 'AGAINST' = assignedSide === 'FOR' ? 'AGAINST' : 'FOR';
    const opponentName = opponent?.name || (team ? team.name : 'AI Opponent');
    
    // Fallback arguments if topic.aiArguments is not available
    const fallbackArguments = {
      pro: [
        "This approach offers significant benefits and should be supported.",
        "The evidence clearly demonstrates the positive impact of this position.",
        "We must consider the long-term advantages this approach provides."
      ],
      con: [
        "There are serious concerns that must be addressed with this approach.",
        "The potential risks and drawbacks cannot be ignored.",
        "Alternative solutions would be more effective and safer."
      ]
    };
    
    const topicArguments = topic?.aiArguments || fallbackArguments;
    
    // Generate contextual response based on topic and user's argument
    const responses = {
      FOR: [
        `I understand your point, but let me present the other side. ${topicArguments.con[Math.floor(Math.random() * topicArguments.con.length)]}`,
        `While that's an interesting perspective, we must consider the negative implications. ${topicArguments.con[Math.floor(Math.random() * topicArguments.con.length)]}`,
        `I respectfully disagree. The evidence shows that ${topicArguments.con[Math.floor(Math.random() * topicArguments.con.length)].toLowerCase()}`,
      ],
      AGAINST: [
        `That's a valid concern, but let me offer a different viewpoint. ${topicArguments.pro[Math.floor(Math.random() * topicArguments.pro.length)]}`,
        `I see your point, however, we should also consider the benefits. ${topicArguments.pro[Math.floor(Math.random() * topicArguments.pro.length)]}`,
        `While I understand your position, I believe ${topicArguments.pro[Math.floor(Math.random() * topicArguments.pro.length)].toLowerCase()}`,
      ]
    };

    const responseTemplates = responses[opposingSide];
    const selectedResponse = responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
    
    // Add contextual reference to user's message
    const contextualResponse = Math.random() > 0.7 ? 
      `You mentioned "${userMessage.slice(0, 50)}..." but ${selectedResponse}` :
      selectedResponse;

    return {
      id: Date.now().toString(),
      speaker: opponentName,
      team: opposingSide,
      message: contextualResponse,
      timestamp: new Date(),
      isUser: false
    } as LiveDebateMessage;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !isMyTurn) return;

    const userMessage: LiveDebateMessage = {
      id: Date.now().toString(),
      speaker: 'You',
      team: assignedSide,
      message: currentMessage.trim(),
      timestamp: new Date(),
      isUser: true
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');
    setIsMyTurn(false);
    setIsSpeaking(false);
    setSpeakingTime(0);

    // For real opponent case, store message in localStorage
    if (realOpponent && currentRoomId) {
      // Store the new message in localStorage for the opponent to see
      const allMessages = JSON.parse(localStorage.getItem(`debate_room_${currentRoomId}_messages`) || '[]');
      allMessages.push(userMessage);
      localStorage.setItem(`debate_room_${currentRoomId}_messages`, JSON.stringify(allMessages));
      
      // Start checking for opponent's response
      checkForOpponentResponse();
      
      return; // Don't generate AI response for real opponents
    }

    // Generate opponent response for AI opponent
    const opponentResponse = await generateOpponentResponse(currentMessage, updatedMessages);
    setMessages(prev => [...prev, opponentResponse]);

    // Check if debate should end
    if (updatedMessages.length >= maxRounds * 2) {
      endDebate();
    } else {
      // Next round
      setRound(prev => prev + 1);
      setIsMyTurn(true);
      setCurrentSpeaker('You');
      
      toast({
        title: "Your Turn",
        description: `Round ${Math.ceil(updatedMessages.length / 2) + 1} - Present your argument`,
      });
    }
  };

  const endDebate = () => {
    // For real opponent case, request agreement to end
    if (realOpponent && endDebateRequested === 'none') {
      setEndDebateRequested('requested');
      
      // Store the end request in localStorage for the opponent to see
      localStorage.setItem(`debate_room_${currentRoomId}_end_requested`, JSON.stringify({
        requestedBy: isRoomHost ? 'host' : 'opponent',
        timestamp: new Date().toISOString()
      }));
      
      toast({
        title: "End Debate Requested",
        description: "Waiting for your opponent to agree to end the debate.",
      });
      
      // Add a system message
      const systemMessage: LiveDebateMessage = {
        id: `sys-${Date.now()}`,
        speaker: "System",
        team: 'FOR', // Default side for system messages
        message: "You have requested to end the debate. Waiting for your opponent to agree.",
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, systemMessage]);
      
      // Set a timer to check for opponent's response
      const checkInterval = setInterval(() => {
        const response = localStorage.getItem(`debate_room_${currentRoomId}_end_approved`);
        if (response) {
          clearInterval(checkInterval);
          completeDebateEnd();
        }
      }, 1000);
      
      // Clear interval after 2 minutes if no response
      setTimeout(() => {
        clearInterval(checkInterval);
        
        // Check current state before updating
        const currentState = localStorage.getItem(`debate_room_${currentRoomId}_end_approved`);
        if (!currentState && endDebateRequested.toString() === 'requested') {
          setEndDebateRequested('none');
          toast({
            title: "End Request Expired",
            description: "Your opponent did not respond to your request to end the debate.",
            variant: "destructive"
          });
        }
      }, 120000);
      
      return;
    } else if (realOpponent && endDebateRequested === 'pending') {
      // Opponent requested to end, we are approving
      localStorage.setItem(`debate_room_${currentRoomId}_end_approved`, JSON.stringify({
        approvedBy: isRoomHost ? 'host' : 'opponent',
        timestamp: new Date().toISOString()
      }));
      
      completeDebateEnd();
    } else {
      // For AI opponent or when both parties agreed
      completeDebateEnd();
    }
  };
  
  // Function to check for opponent's response
  const checkForOpponentResponse = () => {
    console.log("Starting to check for opponent responses");
    
    const checkInterval = setInterval(() => {
      if (!currentRoomId) {
        console.log("No room ID, stopping checks");
        clearInterval(checkInterval);
        return;
      }
      
      // Check localStorage for new messages from the opponent
      try {
        const allMessages = JSON.parse(localStorage.getItem(`debate_room_${currentRoomId}_messages`) || '[]');
        console.log("Checking for messages, found:", allMessages.length);
        
        // If the last message wasn't from the current user (i.e., it's from the opponent)
        // and it's newer than our last message
        if (allMessages.length > 0 && allMessages.length > messages.length) {
          const latestMessage = allMessages[allMessages.length - 1];
          console.log("Found new message:", latestMessage);
          
          // If this is a new message and not from the current user
          if (latestMessage.team !== assignedSide) {
            // Format the message object
            const opponentMessage: LiveDebateMessage = {
              ...latestMessage,
              isUser: false
            };
            
            // Add to our messages
            setMessages(prev => [...prev, opponentMessage]);
            
            // Give turn back to user
            setIsMyTurn(true);
            setCurrentSpeaker('You');
            
            // Clear the interval as we've received a response
            clearInterval(checkInterval);
            
            toast({
              title: "New Response",
              description: `${realOpponent?.name || 'Opponent'} has responded. It's your turn now.`,
            });
          }
        }
      } catch (err) {
        console.error("Error checking messages:", err);
      }
    }, 1000);
    
    // Set a timeout to clear the interval after 2 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      
      // If we still don't have a response, show a notification
      if (!isMyTurn) {
        toast({
          title: "No Response",
          description: "Your opponent seems to be taking a while. You can end the debate if needed.",
          variant: "destructive"
        });
        
        // Optionally give the turn back to the user
        setIsMyTurn(true);
        setCurrentSpeaker('You');
      }
    }, 120000);
  };
  
  // Function to check for end debate requests from opponent
  const checkForEndDebateRequests = () => {
    const checkInterval = setInterval(() => {
      // Check if opponent requested to end the debate
      const endRequest = localStorage.getItem(`debate_room_${currentRoomId}_end_requested`);
      if (endRequest && endDebateRequested === 'none') {
        setEndDebateRequested('pending');
        
        toast({
          title: "End Debate Request",
          description: "Your opponent has requested to end the debate. Do you agree?",
        });
        
        // Add a system message
        const systemMessage: LiveDebateMessage = {
          id: `sys-${Date.now()}`,
          speaker: "System",
          team: 'FOR', // Default side for system messages
          message: "Your opponent has requested to end the debate. Click 'End Debate' if you agree.",
          timestamp: new Date(),
          isUser: false
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    }, 2000);
    
    // Clean up interval
    return () => clearInterval(checkInterval);
  };
  
  // Function to complete the debate end process
  const completeDebateEnd = () => {
    setCurrentPhase('complete');
    
    // Generate debate result
    const result = {
      topic: topic?.title || 'Unknown Topic',
      format,
      rounds: Math.ceil(messages.length / 2),
      totalTime,
      userSide: assignedSide,
      opponent: realOpponent?.name || opponent?.name || (team ? team.name : 'AI Opponent'),
      messages: messages.length,
      score: {
        user: Math.floor(Math.random() * 30) + 70, // 70-100
        opponent: Math.floor(Math.random() * 30) + 65, // 65-95
      },
      evaluation: {
        arguments: Math.floor(Math.random() * 20) + 80,
        evidence: Math.floor(Math.random() * 20) + 75,
        delivery: Math.floor(Math.random() * 20) + 85,
        rebuttals: Math.floor(Math.random() * 20) + 70,
      },
      tokensEarned: Math.floor(Math.random() * 20) + 15,
    };
    
    // Add a system message about the debate ending
    const systemMessage: LiveDebateMessage = {
      id: `sys-${Date.now()}`,
      speaker: "System",
      team: 'FOR', // Default side for system messages
      message: "The debate has ended. Thank you for participating!",
      timestamp: new Date(),
      isUser: false
    };
    setMessages(prev => [...prev, systemMessage]);
    
    setDebateResult(result);
    onComplete(result);
    
    toast({
      title: "Debate Concluded!",
      description: "Thank you for participating. View your results and summary.",
    });
  };

  const handleStartSpeaking = () => {
    setIsSpeaking(true);
    setSpeakingTime(0);
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to render the debate messages
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500 font-medium">No messages yet</p>
            <p className="text-sm text-gray-400">
              {isMyTurn 
                ? "It's your turn to start the debate" 
                : "Waiting for your opponent to start"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                msg.team === 'FOR' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : msg.team === 'AGAINST'
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-gray-50 border border-gray-200' // For system messages
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-semibold text-sm">
                  {msg.speaker}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                {msg.team !== 'FOR' && msg.team !== 'AGAINST' ? (
                  <Badge variant="outline" className="ml-2 text-xs">
                    SYSTEM
                  </Badge>
                ) : (
                  <Badge 
                    variant={msg.team === 'FOR' ? 'default' : 'destructive'} 
                    className="ml-2 text-xs"
                  >
                    {msg.team}
                  </Badge>
                )}
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>
    );
  };

  const renderCompleteDebate = () => {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Debate Complete</h1>
            <p className="text-gray-600 mt-2">Here's how you did</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Debate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Topic</p>
                    <p className="font-medium">{debateResult.topic}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="font-medium">{debateResult.format}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Your Position</p>
                    <p className="font-medium">{debateResult.userSide}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Opponent</p>
                    <p className="font-medium">{debateResult.opponent}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Rounds</p>
                    <p className="font-medium">{debateResult.rounds}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{formatTime(debateResult.totalTime)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Evaluation</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between">
                        <span>Arguments</span>
                        <span>{debateResult.evaluation.arguments}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${debateResult.evaluation.arguments}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Evidence Use</span>
                        <span>{debateResult.evaluation.evidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${debateResult.evaluation.evidence}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>{debateResult.evaluation.delivery}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${debateResult.evaluation.delivery}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Rebuttals</span>
                        <span>{debateResult.evaluation.rebuttals}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${debateResult.evaluation.rebuttals}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debate History */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Debate Transcript</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {renderMessages()}
              </CardContent>
            </Card>
          </div>

          <div>
            {/* Score Card */}
            <Card>
              <CardHeader>
                <CardTitle>Final Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600">{debateResult.score.user}</div>
                <p className="text-sm text-gray-500 mt-1">Your Score</p>
                
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-semibold">{debateResult.score.opponent}</div>
                    <p className="text-xs text-gray-500">Opponent</p>
                  </div>
                  <div className="text-lg font-bold">vs</div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">{debateResult.score.user}</div>
                    <p className="text-xs text-gray-500">You</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Badge variant="outline" className="mb-2 bg-green-50 text-green-700">
                    <Star className="h-3 w-3 mr-1" /> {debateResult.tokensEarned} tokens earned
                  </Badge>
                  
                  <p className="text-sm text-gray-600">
                    {debateResult.score.user > debateResult.score.opponent 
                      ? "Congratulations on your win!" 
                      : debateResult.score.user < debateResult.score.opponent
                      ? "Great effort! Learn from this experience."
                      : "It was a tie! Both sides presented strong arguments."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="mt-4">
              <CardContent className="p-4 space-y-2">
                <Button onClick={handleExitRoom} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderWaitingRoom = () => {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Room Status */}
        {renderRoomStatus()}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Debate Preparation</h1>
            <p className="text-gray-600 mt-2">Get ready to debate{roomId ? ' with your opponent' : ''}</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Topic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Topic Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{topic?.title || 'Unknown Topic'}</h3>
              <p className="text-gray-600 mt-2">{topic?.description || 'No description available'}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-2" />
                {getTopicTimeEstimate(topic)}
              </Badge>
              <Badge variant="outline">
                <Trophy className="h-3 w-3 mr-2" />
                {getTopicDifficulty(topic)}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Waiting for opponent card */}
        {currentRoomId && roomStatus === 'waiting' ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="font-medium text-blue-700 mb-2">Waiting for opponent to join...</p>
                <p className="text-sm text-gray-600">Share room code: <span className="font-bold">{currentRoomId}</span></p>
                <Button variant="outline" size="sm" className="mt-2" onClick={copyRoomId}>
                  <Copy className="h-3 w-3 mr-2" /> Copy Room Code
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : realOpponent ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-medium text-green-700 mb-1">
                  {realOpponent.name} has joined your debate!
                </p>
                <p className="text-sm text-gray-600">
                  Ready to start the debate
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-2 text-lg font-semibold mt-4"
                  onClick={handleStartDebate}
                >
                  Start Debate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-semibold"
                onClick={handleStartDebate}
              >
                Start Debate
              </Button>
              <p className="mt-4 text-gray-600">Click when you're ready to begin</p>
            </CardContent>
          </Card>
        )}

        {/* Render the invite/join dialogs */}
        {renderDialogs()}
      </div>
    );
  };

  const renderActiveDebate = () => {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Room Status */}
        {renderRoomStatus()}
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎯 Live Debate</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline" className="text-blue-700 bg-blue-50">
                📝 {topic?.title || 'Debate Topic'}
              </Badge>
              <Badge variant={assignedSide === 'FOR' ? 'default' : 'destructive'}>
                You: {assignedSide}
              </Badge>
              <Badge variant="outline">
                Round: {round}/{maxRounds}
              </Badge>
              <Badge variant="outline">
                <Timer className="h-3 w-3 mr-1" />
                {formatTime(totalTime)}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Debate
          </Button>
        </div>

        {/* Debate Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="h-96 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Debate Discussion</span>
                  {isMyTurn && (
                    <Badge className="bg-green-100 text-green-700">
                      Your Turn
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {renderMessages()}
              </CardContent>
            </Card>

            {/* Input Area */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder={
                        isMyTurn 
                          ? "Present your argument..." 
                          : "Wait for your turn..."
                      }
                      disabled={!isMyTurn}
                      className="min-h-[80px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={isRecording ? handleStopSpeaking : handleStartSpeaking}
                      variant={isRecording ? 'destructive' : 'outline'}
                      size="sm"
                      disabled={!isMyTurn}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || !isMyTurn}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {isSpeaking && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    Speaking: {formatTime(speakingTime)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Current Speaker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Speaker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {isMyTurn ? 'Your Turn' : 'Opponent Speaking'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isMyTurn ? 'Present your argument' : 'Wait for your turn'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debate Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Debate Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Round:</span>
                  <span>{round}/{maxRounds}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Messages:</span>
                  <span>{messages.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Your Side:</span>
                  <Badge variant={assignedSide === 'FOR' ? 'default' : 'destructive'} className="text-xs">
                    {assignedSide}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(round / maxRounds) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Manual End Option */}
            <Card>
              <CardContent className="p-4">
                {endDebateRequested === 'pending' ? (
                  <Button
                    onClick={endDebate}
                    variant="destructive"
                    className="w-full"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Agree to End Debate
                  </Button>
                ) : endDebateRequested === 'requested' ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    Waiting for Opponent...
                  </Button>
                ) : (
                  <Button
                    onClick={endDebate}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    End Debate
                  </Button>
                )}
                
                {/* Debug button to fix potential issues */}
                <Button
                  onClick={fixDebateState}
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-gray-500"
                >
                  Debug: Enable Input
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Debug helper function for testing
  const fixDebateState = () => {
    setIsMyTurn(true);
    setCurrentPhase('active');
    toast({
      title: "Debug: State Fixed",
      description: "Message input has been enabled for testing",
    });
  };
  
  // Clear room ID when leaving the debate room
  const handleExitRoom = () => {
    if (currentRoomId) {
      // Clean up localStorage
      localStorage.removeItem(`debate_room_${currentRoomId}_host`);
      localStorage.removeItem(`debate_room_${currentRoomId}_opponent`);
      localStorage.removeItem(`debate_room_${currentRoomId}_messages`);
      localStorage.removeItem(`debate_room_${currentRoomId}_end_requested`);
      localStorage.removeItem(`debate_room_${currentRoomId}_end_approved`);
      localStorage.removeItem('current_debate_room_id');
    }
    
    // Reset state
    setRoomId('');
    setIsRoomHost(false);
    setRoomStatus('connected');
    setWaitingForOpponent(false);
    setRealOpponent(null);
    
    // Navigate back
    onBack();
  };

  // Render based on current phase
  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚠️ No Topic Selected</h1>
            <p className="text-gray-600 mt-2">Please go back and select a topic to start the debate</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">No debate topic has been selected. Redirecting to topic selection...</p>
            <Button onClick={onBack} className="mr-2">
              Return to Topic Selection
            </Button>
            <Button onClick={fixDebateState} variant="outline">
              Debug: Fix Message Input
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentPhase === 'complete') {
    return renderCompleteDebate();
  }

  if (currentPhase === 'waiting') {
    return renderWaitingRoom();
  }

  return renderActiveDebate();
};

export default LiveDebateRoomV3;
