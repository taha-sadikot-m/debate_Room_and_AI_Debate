import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Share2, Link, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface LiveDebateRoomHelperProps {
  format: '1v1' | '3v3';
  onRealOpponentJoined: (opponent: OnlineUser) => void;
}

const LiveDebateRoomHelper = ({ format, onRealOpponentJoined }: LiveDebateRoomHelperProps) => {
  const [roomId, setRoomId] = useState<string>('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState<boolean>(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState<boolean>(false);
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const [waitingForOpponent, setWaitingForOpponent] = useState<boolean>(false);
  const { toast } = useToast();

  // Generate room ID when component mounts
  useEffect(() => {
    if (format === '1v1') {
      const generatedId = generateRoomId();
      setRoomId(generatedId);
      
      // For testing: Listen for opponent joining using window storage
      // In a real app, this would be handled by a backend
      const checkForOpponentInterval = setInterval(() => {
        const storedData = localStorage.getItem(`debate_room_${generatedId}_opponent`);
        if (storedData) {
          try {
            const opponentData = JSON.parse(storedData);
            onRealOpponentJoined(opponentData);
            setWaitingForOpponent(false);
            clearInterval(checkForOpponentInterval);
            
            toast({
              title: "Opponent Joined!",
              description: `${opponentData.name} has joined the debate.`,
            });
          } catch (e) {
            console.error("Failed to parse opponent data", e);
          }
        }
      }, 2000);
      
      return () => clearInterval(checkForOpponentInterval);
    }
  }, [format, onRealOpponentJoined, toast]);

  // Generate a random room ID
  const generateRoomId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  // Handle copying room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard",
    });
  };
  
  // Handle joining a room
  const handleJoinRoom = () => {
    if (!joinRoomId) {
      toast({
        title: "Error",
        description: "Please enter a valid room ID",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would make an API call to join the room
    // For now, we'll just store the user data in localStorage for the other client to find
    const mockCurrentUser: OnlineUser = {
      id: `user-${Math.floor(Math.random() * 1000)}`,
      name: `Guest-${Math.floor(Math.random() * 100)}`,
      level: 'Intermediate',
      tokens: Math.floor(Math.random() * 500),
      country: 'Unknown',
      status: 'available'
    };
    
    localStorage.setItem(`debate_room_${joinRoomId}_opponent`, JSON.stringify(mockCurrentUser));
    
    toast({
      title: "Joining Room",
      description: `Connecting to debate room ${joinRoomId}`,
    });
    
    // For testing: Simulate waiting and then joining
    setTimeout(() => {
      setIsJoinDialogOpen(false);
      // In a real app, this would redirect to the actual room
      // For now, we'll just show a success message
      toast({
        title: "Joined Successfully",
        description: "You have joined the debate room",
      });
    }, 1500);
  };

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
                <div className="text-3xl font-bold tracking-wider">{roomId}</div>
              </div>
            </div>
            
            <DialogFooter>
              <Button className="w-full" onClick={copyRoomId}>
                <Copy className="h-4 w-4 mr-2" /> Copy Room Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Join Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a Debate Room</DialogTitle>
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

  if (format !== '1v1') {
    return null;
  }

  return (
    <>
      {renderDialogs()}
      
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-lg text-blue-700">
            <UserPlus className="h-5 w-5 mr-2" />
            <span>Debate with a Real Person</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Instead of debating against AI, invite a friend to join this room and debate with you in real-time.
            </p>
            
            {waitingForOpponent ? (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="font-medium text-blue-700 mb-2">Waiting for opponent to join...</p>
                <p className="text-sm text-gray-600">Share room code: <span className="font-bold">{roomId}</span></p>
                <Button variant="outline" size="sm" className="mt-2" onClick={copyRoomId}>
                  <Copy className="h-3 w-3 mr-2" /> Copy Room Code
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setIsInviteDialogOpen(true);
                    setWaitingForOpponent(true);
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite Opponent
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsJoinDialogOpen(true)}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Join Debate Room
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LiveDebateRoomHelper;
