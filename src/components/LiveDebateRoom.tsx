import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Users, ArrowLeft, Target, Trophy, Plus, Clock, Globe, Zap, Share2, Copy, Link, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LiveDebateTopic, getTopicsByDifficultyAndTheme } from '@/data/liveDebateTopics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface Team {
  id: string;
  name: string;
  members: OnlineUser[];
  rating: number;
  wins: number;
  losses: number;
}

interface LiveDebateRoomProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  format: '1v1' | '3v3';
  onBack: () => void;
  onStartDebate: (topic: LiveDebateTopic, opponent?: OnlineUser, team?: Team, roomId?: string) => void;
}

const LiveDebateRoom = ({ difficulty, theme, format, onBack, onStartDebate }: LiveDebateRoomProps) => {
  const [selectedTopic, setSelectedTopic] = useState<LiveDebateTopic | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<OnlineUser | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [topics, setTopics] = useState<LiveDebateTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(true);
  const { toast } = useToast();

  // Generate a unique room ID
  const generateRoomId = () => {
    // Generate a random 6-character string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Get shareable room link
  const getRoomLink = (roomId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/join-debate/${roomId}`;
  };

  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      // Use static topics instead of Supabase
      const staticTopics = getTopicsByDifficultyAndTheme(difficulty, theme);
      setTopics(staticTopics);
      
      // If no topics found, show all topics for that difficulty
      if (staticTopics.length === 0) {
        const allTopics = getTopicsByDifficultyAndTheme(difficulty, '');
        setTopics(allTopics);
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      toast({
        title: 'Error',
        description: 'Failed to load topics. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [difficulty, theme]);

  // Mock users for different levels and countries
  const mockUsers: OnlineUser[] = [
    {
      id: 'user-1',
      name: 'Alice Johnson',
      level: 'Intermediate',
      tokens: 340,
      country: 'USA',
      status: 'available',
    },
    {
      id: 'user-2',
      name: 'Bob Williams',
      level: 'Beginner',
      tokens: 150,
      country: 'Canada',
      status: 'available',
    },
    {
      id: 'user-3',
      name: 'Chen Wei',
      level: 'Advanced',
      tokens: 890,
      country: 'China',
      status: 'available',
    },
    {
      id: 'user-4',
      name: 'Priya Sharma',
      level: 'Intermediate',
      tokens: 420,
      country: 'India',
      status: 'available',
    },
    {
      id: 'user-5',
      name: 'Mohammed Al-Rashid',
      level: 'Advanced',
      tokens: 750,
      country: 'UAE',
      status: 'available',
    },
    {
      id: 'user-6',
      name: 'Emma Thompson',
      level: 'Beginner',
      tokens: 95,
      country: 'UK',
      status: 'available',
    },
    {
      id: 'user-7',
      name: 'João Silva',
      level: 'Intermediate',
      tokens: 280,
      country: 'Brazil',
      status: 'available',
    },
    {
      id: 'user-8',
      name: 'Yuki Tanaka',
      level: 'Advanced',
      tokens: 620,
      country: 'Japan',
      status: 'available',
    }
  ];

  // Mock teams for 3v3 format
  const mockTeams: Team[] = [
    {
      id: 'team-1',
      name: 'Global Advocates',
      members: [mockUsers[0], mockUsers[3], mockUsers[6]],
      rating: 1650,
      wins: 23,
      losses: 12
    },
    {
      id: 'team-2',
      name: 'Logic Masters',
      members: [mockUsers[2], mockUsers[4], mockUsers[7]],
      rating: 1820,
      wins: 31,
      losses: 8
    },
    {
      id: 'team-3',
      name: 'Rising Stars',
      members: [mockUsers[1], mockUsers[5], mockUsers[0]],
      rating: 1420,
      wins: 18,
      losses: 15
    },
    {
      id: 'team-4',
      name: 'Debate Dynasty',
      members: [mockUsers[2], mockUsers[3], mockUsers[7]],
      rating: 1950,
      wins: 45,
      losses: 5
    }
  ];

  const availableUsers = mockUsers.filter(user => user.status === 'available');
  const availableTeams = mockTeams;

  // Suggest a topic form
  const suggestForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      timeEstimate: '',
    }
  });

  const onSuggestTopic = async (values: any) => {
    try {
      // For now, just show a success message since we're using static topics
      toast({ 
        title: 'Topic Suggested', 
        description: 'Your topic suggestion has been submitted and will be reviewed by our team.' 
      });
      suggestForm.reset();
    } catch (err) {
      console.error('Error suggesting topic:', err);
      toast({ 
        title: 'Error', 
        description: 'Failed to suggest topic. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleStartDebate = () => {
    if (!selectedTopic) {
      toast({
        title: 'No Topic Selected',
        description: 'Please select a topic for the debate.',
        variant: 'destructive'
      });
      return;
    }

    if (format === '1v1') {
      // For 1v1 debates with room joining
      if (joinRoomId) {
        // If we're joining an existing room
        onStartDebate(selectedTopic, selectedOpponent, undefined, joinRoomId);
        return;
      }
      
      // Otherwise check if opponent is selected for new room
      if (!selectedOpponent && !roomId) {
        toast({
          title: 'No Opponent Selected',
          description: 'Please select an opponent for the 1v1 debate or join an existing room.',
          variant: 'destructive'
        });
        return;
      }
      
      // Generate room ID for 1v1 debates if one doesn't exist
      if (!isCreating) {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        setIsCreating(true);
        toast({
          title: 'Debate Room Created',
          description: `Room ID: ${newRoomId}. You can share this with others to join.`,
        });
        // Show invite dialog
        setShowInviteDialog(true);
      } else {
        // If room is already created, start the debate
        onStartDebate(selectedTopic, selectedOpponent, undefined, roomId);
      }
    } else if (format === '3v3') {
      if (!selectedTeam) {
        toast({
          title: 'No Team Selected',
          description: 'Please select a team for the 3v3 debate.',
          variant: 'destructive'
        });
        return;
      }
      onStartDebate(selectedTopic, undefined, selectedTeam);
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: 'Room ID Copied',
      description: 'The room ID has been copied to your clipboard.',
    });
  };

  const handleCopyRoomLink = () => {
    const roomLink = getRoomLink(roomId);
    navigator.clipboard.writeText(roomLink);
    toast({
      title: 'Link Copied',
      description: 'The room link has been copied to your clipboard.',
    });
  };

  const handleJoinRoom = () => {
    if (!joinRoomId) {
      toast({
        title: 'No Room ID',
        description: 'Please enter a room ID to join.',
        variant: 'destructive'
      });
      return;
    }

    // Here you would implement the actual room joining logic
    toast({
      title: 'Joining Room',
      description: `Attempting to join room: ${joinRoomId}`,
    });

    // For now, we'll simulate joining by selecting the first topic only
    // We don't select an opponent because in a real implementation, 
    // the opponent would be the human host of the room
    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
    }
    
    // Close the dialog
    setShowInviteDialog(false);
    
    // Start the debate with simulated topic but no AI opponent since we're joining a room
    // with a human opponent
    if (selectedTopic) {
      onStartDebate(selectedTopic, undefined, undefined, joinRoomId);
    } else {
      // If no topic is available, show a warning
      toast({
        title: 'No Topic Available',
        description: 'Unable to find a debate topic. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Invite Dialog UI
  const renderInviteDialog = () => (
    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Debate Room</DialogTitle>
          <DialogDescription>
            {isCreating ? 'Share this room ID with others to join your debate.' : 'Enter a room ID to join an existing debate.'}
          </DialogDescription>
        </DialogHeader>
        
        {isRoomCreated ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="room-id">Room ID</Label>
                <Input
                  id="room-id"
                  value={roomId}
                  readOnly
                  className="font-mono"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="mt-4"
                onClick={handleCopyRoomId}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="room-link">Room Link</Label>
                <Input
                  id="room-link"
                  value={getRoomLink(roomId)}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="mt-4"
                onClick={handleCopyRoomLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="join-room-id">Room ID</Label>
                <Input
                  id="join-room-id"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  className="font-mono"
                  placeholder="Enter room ID"
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => setShowInviteDialog(false)}
          >
            Cancel
          </Button>
          
          {isCreating ? (
            <Button onClick={() => {
              setIsRoomCreated(true);
              toast({
                title: 'Room Created',
                description: `Room ID: ${roomId} has been created. Share this with your opponent.`,
              });
            }}>
              Create Room
            </Button>
          ) : (
            <Button onClick={handleJoinRoom}>
              Join Room
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Add room creation and join buttons to the UI
  const renderRoomControls = () => (
    <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
      <Button 
        variant="outline"
        onClick={() => {
          setIsCreating(true);
          setRoomId(generateRoomId());
          setShowInviteDialog(true);
        }}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Create Room
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => {
          setIsCreating(false);
          setJoinRoomId("");
          setShowInviteDialog(true);
        }}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        Join Room
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Debate Room</h1>
          <p className="text-gray-600 mt-2">
            {format === '1v1' 
              ? 'Select a topic and opponent for your 1v1 debate' 
              : 'Select a topic and team for your 3v3 debate'
            }
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline" className="text-sm">
              <Target className="h-3 w-3 mr-1" />
              {difficulty}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Globe className="h-3 w-3 mr-1" />
              {theme}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Users className="h-3 w-3 mr-1" />
              {format}
            </Badge>
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Suggest a Topic Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Suggest a Topic
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Suggest a Topic</DialogTitle></DialogHeader>
          <Form {...suggestForm}>
            <form onSubmit={suggestForm.handleSubmit(onSuggestTopic)} className="space-y-4">
              <FormField
                control={suggestForm.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={suggestForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={suggestForm.control}
                name="timeEstimate"
                rules={{ required: "Estimated time is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Estimate</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., 15-20 min" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit Suggestion</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Available Topics</span>
            <Badge className="bg-blue-100 text-blue-700">
              {loadingTopics ? 'Loading...' : `${topics.length} topics`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopics ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No topics available for {difficulty} level {theme} debates.</p>
              <p className="text-sm text-gray-400 mt-2">Try selecting a different difficulty or theme.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTopic?.id === topic.id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {topic.time_estimate}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`text-xs ${
                        topic.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {topic.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {topic.format === 'both' ? 'All Formats' : topic.format}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Opponent/Team Selection */}
      {format === '1v1' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-600" />
              <span>Available Opponents</span>
              <Badge className="bg-green-100 text-green-700">{availableUsers.length} online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOpponent?.id === user.id 
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOpponent(user)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <Badge 
                      className={`text-xs ${
                        user.level === 'Beginner' ? 'bg-blue-100 text-blue-700' :
                        user.level === 'Intermediate' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {user.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{user.country}</p>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm text-gray-600">{user.tokens}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span>Available Teams</span>
              <Badge className="bg-purple-100 text-purple-700">{availableTeams.length} teams</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTeams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTeam?.id === team.id 
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                      Rating: {team.rating}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Members:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {team.members.map((member, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {member.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Record: {team.wins}W - {team.losses}L</span>
                      <span>Win Rate: {Math.round((team.wins / (team.wins + team.losses)) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Guarantee */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>Token Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {format === '1v1' ? '5-15' : '10-20'}
              </div>
              <p className="text-sm text-gray-600">Base Tokens</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">+25%</div>
              <p className="text-sm text-gray-600">Win Bonus</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">+10%</div>
              <p className="text-sm text-gray-600">Performance Bonus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Controls for 1v1 format */}
      {format === '1v1' && renderRoomControls()}

      {/* Start Debate */}
      <div className="flex justify-center mt-6">
        <Button
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold"
          size="lg"
          onClick={handleStartDebate}
          disabled={!selectedTopic || (!selectedOpponent && !joinRoomId)}
        >
          <Zap className="h-5 w-5 mr-2" />
          Start {format} Debate
        </Button>
      </div>

      {/* Room Invite Dialog */}
      {renderInviteDialog()}
    </div>
  );
};

export default LiveDebateRoom;
