import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Trophy,
  Lightbulb,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Star,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DebateConfig, DebateTopic, SuggestedTopic, TOPIC_CATEGORIES } from '@/types/debate';
import { TopicService } from '@/services/topicService';
import { supabase } from '@/integrations/supabase/client';

interface AdvancedTopicManagerProps {
  onTopicSelect: (topic: string, category: string) => void;
  onCreateDebate: (config: DebateConfig) => void;
  selectedTopic?: string;
  selectedCategory?: string;
}

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
  debates_won: number;
  total_debates: number;
}

const AdvancedTopicManager = ({ 
  onTopicSelect, 
  onCreateDebate, 
  selectedTopic = '', 
  selectedCategory = '' 
}: AdvancedTopicManagerProps) => {
  // State management
  const [topics, setTopics] = useState<DebateTopic[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<DebateTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(selectedCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'alphabetical'>('newest');
  
  // Topic creation
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  
  // User selection for debates
  const [availableUsers, setAvailableUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'suggested'>('browse');
  
  const { toast } = useToast();

  // Mock users data - In production, this would come from Supabase
  const mockUsers: OnlineUser[] = [
    {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      level: 'Advanced',
      tokens: 245,
      country: 'USA',
      status: 'available',
      debates_won: 18,
      total_debates: 25
    },
    {
      id: 'user-2',
      name: 'Maya Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      level: 'Intermediate',
      tokens: 156,
      country: 'India',
      status: 'available',
      debates_won: 12,
      total_debates: 20
    },
    {
      id: 'user-3',
      name: 'João Silva',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
      level: 'Beginner',
      tokens: 89,
      country: 'Brazil',
      status: 'available',
      debates_won: 3,
      total_debates: 8
    },
    {
      id: 'user-4',
      name: 'Emma Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      level: 'Advanced',
      tokens: 312,
      country: 'UK',
      status: 'available',
      debates_won: 28,
      total_debates: 35
    }
  ];

  // Load data on component mount
  useEffect(() => {
    loadTopics();
    loadSuggestedTopics();
    setAvailableUsers(mockUsers.filter(user => user.status === 'available'));
  }, [selectedCategoryFilter]);

  // Filter and sort topics
  useEffect(() => {
    let filtered = [...topics];
    
    // Filter by category
    if (selectedCategoryFilter) {
      filtered = filtered.filter(topic => topic.category === selectedCategoryFilter);
    }
    
    // Filter by search keyword
    if (searchKeyword) {
      filtered = filtered.filter(topic =>
        topic.topic_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    // Sort topics
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.topic_name.localeCompare(b.topic_name));
        break;
      case 'popular':
        // For now, just randomize - in production, you'd track usage stats
        filtered.sort(() => Math.random() - 0.5);
        break;
    }
    
    setFilteredTopics(filtered);
  }, [topics, searchKeyword, selectedCategoryFilter, sortBy]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const loadedTopics = await TopicService.getDebateTopics(selectedCategoryFilter || undefined);
      setTopics(loadedTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast({
        title: "Error loading topics",
        description: "Failed to load debate topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedTopics = async () => {
    try {
      const suggestions = await TopicService.getSuggestedTopics();
      setSuggestedTopics(suggestions.filter(s => s.status === 'pending'));
    } catch (error) {
      console.error('Error loading suggested topics:', error);
    }
  };

  const handleCreateTopic = async () => {
    if (!newTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic name.",
        variant: "destructive",
      });
      return;
    }

    if (!newTopicCategory) {
      toast({
        title: "Category required",
        description: "Please select a category for your topic.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdTopic = await TopicService.addDebateTopic({
        topic_name: newTopic.trim(),
        category: newTopicCategory,
        description: newTopicDescription.trim() || undefined,
        status: 'active'
      });

      if (createdTopic) {
        toast({
          title: "Topic created successfully!",
          description: "Your topic has been added and is ready for debates.",
        });
        
        setNewTopic('');
        setNewTopicDescription('');
        setNewTopicCategory('');
        setShowCreateDialog(false);
        
        await loadTopics();
        onTopicSelect(createdTopic.topic_name, createdTopic.category);
      } else {
        throw new Error('Failed to create topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: "Error creating topic",
        description: "Failed to create the topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTopic = async () => {
    if (!newTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const suggestion = await TopicService.suggestTopic({
        topic_name: newTopic.trim(),
        theme: newTopicCategory || undefined,
        status: 'pending'
      });

      if (suggestion) {
        toast({
          title: "Topic suggested successfully!",
          description: "Your suggestion will be reviewed and may be added to the database.",
        });
        
        setNewTopic('');
        setNewTopicDescription('');
        setNewTopicCategory('');
        
        await loadSuggestedTopics();
      } else {
        throw new Error('Failed to suggest topic');
      }
    } catch (error) {
      console.error('Error suggesting topic:', error);
      toast({
        title: "Error suggesting topic",
        description: "Failed to suggest the topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartDebateWithUser = (topic: DebateTopic, opponent: OnlineUser) => {
    const config: DebateConfig = {
      topic: topic.topic_name,
      userPosition: 'for', // Default position, user can change in setup
      firstSpeaker: 'user',
      category: topic.category,
      // Add opponent info for live debates
      opponent: {
        id: opponent.id,
        name: opponent.name,
        level: opponent.level
      }
    };
    
    onCreateDebate(config);
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700',
      politics: 'bg-red-100 text-red-700',
      environment: 'bg-green-100 text-green-700',
      education: 'bg-purple-100 text-purple-700',
      health: 'bg-pink-100 text-pink-700',
      economics: 'bg-yellow-100 text-yellow-700',
      ethics: 'bg-indigo-100 text-indigo-700',
      culture: 'bg-orange-100 text-orange-700',
      science: 'bg-cyan-100 text-cyan-700',
      sports: 'bg-teal-100 text-teal-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
            Advanced Topic Manager
          </h1>
          <p className="text-gray-600 mt-2">Browse topics, create new ones, and find debate opponents</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Debate Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newTopic">Topic Statement</Label>
                  <Input
                    id="newTopic"
                    placeholder="Enter debate topic..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="newCategory">Category</Label>
                  <Select value={newTopicCategory} onValueChange={setNewTopicCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPIC_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="newDescription">Description (Optional)</Label>
                  <Textarea
                    id="newDescription"
                    placeholder="Brief description..."
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreateTopic}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create & Use
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSuggestTopic}
                    disabled={loading}
                    className="flex-1"
                  >
                    Suggest for Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={loadTopics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Topics</TabsTrigger>
          <TabsTrigger value="create">Community Topics</TabsTrigger>
          <TabsTrigger value="suggested">
            Suggested ({suggestedTopics.length})
          </TabsTrigger>
        </TabsList>

        {/* Browse Topics Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search topics..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {TOPIC_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Topics Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-3" />
              <span>Loading topics...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getCategoryColor(topic.category)}>
                        {TOPIC_CATEGORIES.find(c => c.id === topic.category)?.name || topic.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTopicSelect(topic.topic_name, topic.category)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {topic.topic_name}
                    </CardTitle>
                    {topic.description && (
                      <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => onTopicSelect(topic.topic_name, topic.category)}
                        size="sm"
                        className="flex-1 mr-2"
                      >
                        Start AI Debate
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-1" />
                            vs User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Choose Your Opponent</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {availableUsers.map((user) => (
                              <div
                                key={user.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                  selectedUser?.id === user.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedUser(user)}
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-semibold">{user.name}</h4>
                                      <Badge className={getLevelBadgeColor(user.level)}>
                                        {user.level}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                      <span>🏆 {user.debates_won}/{user.total_debates}</span>
                                      <span>🪙 {user.tokens} tokens</span>
                                      <span>🌍 {user.country}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {selectedUser && (
                              <Button
                                onClick={() => handleStartDebateWithUser(topic, selectedUser)}
                                className="w-full"
                              >
                                Start Debate with {selectedUser.name}
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredTopics.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Topics Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchKeyword 
                    ? 'Try adjusting your search terms or filters.'
                    : 'Be the first to create a topic in this category!'
                  }
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Topic
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Community Topics Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Community-Created Topics
              </CardTitle>
              <p className="text-gray-600">Topics created by our debate community</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.filter(topic => topic.student_id).map((topic) => (
                  <div key={topic.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(topic.category)}>
                        {TOPIC_CATEGORIES.find(c => c.id === topic.category)?.name}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(topic.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold mb-1">{topic.topic_name}</h4>
                    {topic.description && (
                      <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                    )}
                    <Button
                      size="sm"
                      onClick={() => onTopicSelect(topic.topic_name, topic.category)}
                      className="w-full"
                    >
                      Use This Topic
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggested Topics Tab */}
        <TabsContent value="suggested" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Pending Suggestions
              </CardTitle>
              <p className="text-gray-600">Topics suggested by users awaiting review</p>
            </CardHeader>
            <CardContent>
              {suggestedTopics.length > 0 ? (
                <div className="space-y-4">
                  {suggestedTopics.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 border border-dashed rounded-lg bg-yellow-50">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                          {suggestion.theme || 'General'}
                        </Badge>
                        <Badge variant="outline">Pending Review</Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{suggestion.topic_name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Suggested {new Date(suggestion.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No pending suggestions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTopicManager;
