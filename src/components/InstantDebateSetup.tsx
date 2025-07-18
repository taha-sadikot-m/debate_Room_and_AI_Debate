import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Zap, Search, Plus, Loader2 } from 'lucide-react';
import { DebateConfig, DebateTopic, TOPIC_CATEGORIES } from '@/types/debate';
import { TopicService } from '@/services/topicService';

interface InstantDebateSetupProps {
  onStartDebate: (config: DebateConfig) => void;
  onBack: () => void;
}

const InstantDebateSetup = ({ onStartDebate, onBack }: InstantDebateSetupProps) => {
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [topics, setTopics] = useState<DebateTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<DebateTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);

  // Load topics on component mount
  useEffect(() => {
    loadTopics();
  }, [selectedCategory]);

  // Filter topics based on search
  useEffect(() => {
    if (searchKeyword) {
      const filtered = topics.filter(topic =>
        topic.topic_name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(topics);
    }
  }, [topics, searchKeyword]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const loadedTopics = await TopicService.getDebateTopics(selectedCategory || undefined);
      setTopics(loadedTopics);
      setFilteredTopics(loadedTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomTopic = async () => {
    if (!customTopic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const newTopic = await TopicService.addDebateTopic({
        topic_name: customTopic.trim(),
        category: selectedCategory || 'general',
        description: newTopicDescription.trim() || undefined,
        status: 'active'
      });

      if (newTopic) {
        setTopic(newTopic.topic_name);
        setCustomTopic('');
        setNewTopicDescription('');
        setShowAddTopic(false);
        await loadTopics(); // Refresh topics list
        alert('Topic added successfully!');
      } else {
        alert('Failed to add topic. Please try again.');
      }
    } catch (error) {
      console.error('Error adding topic:', error);
      alert('Error adding topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTopic = async () => {
    if (!customTopic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const suggestion = await TopicService.suggestTopic({
        topic_name: customTopic.trim(),
        theme: selectedCategory || undefined,
        status: 'pending'
      });

      if (suggestion) {
        setCustomTopic('');
        setNewTopicDescription('');
        setShowAddTopic(false);
        alert('Topic suggested successfully! It will be reviewed and added to the database.');
      } else {
        alert('Failed to suggest topic. Please try again.');
      }
    } catch (error) {
      console.error('Error suggesting topic:', error);
      alert('Error suggesting topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDebate = () => {
    console.log('handleStartDebate called with:', { topic, userPosition, firstSpeaker });
    
    if (!topic.trim()) {
      alert('Please enter or select a debate topic');
      return;
    }

    const config: DebateConfig = {
      topic: topic.trim(),
      userPosition,
      firstSpeaker,
      category: selectedCategory || undefined
    };
    
    console.log('Starting debate with config:', config);
    onStartDebate(config);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 text-yellow-500 mr-2" />
            Instant AI Debate
          </h1>
          <p className="text-gray-600 mt-2">Choose your topic and position to start debating instantly</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow-lg">
        <CardHeader>
          <CardTitle>Debate Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Topic Category</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {TOPIC_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  <Badge variant="secondary" className={`w-3 h-3 bg-${category.color}-500`}></Badge>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Topics */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Topics</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search for debate topics..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Selected Debate Topic</Label>
            <Input
              id="topic"
              placeholder="Select a topic below or enter your own"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-lg p-4"
            />
          </div>

          {/* Available Topics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Available Topics {selectedCategory && `(${TOPIC_CATEGORIES.find(c => c.id === selectedCategory)?.name})`}</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddTopic(!showAddTopic)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Topic
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading topics...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {filteredTopics.map((dbTopic, index) => (
                  <Button
                    key={dbTopic.id || index}
                    variant={topic === dbTopic.topic_name ? 'default' : 'outline'}
                    className="text-left justify-start h-auto p-3 text-sm"
                    onClick={() => setTopic(dbTopic.topic_name)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{dbTopic.topic_name}</span>
                      {dbTopic.description && (
                        <span className="text-xs text-gray-500 mt-1">{dbTopic.description}</span>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {TOPIC_CATEGORIES.find(c => c.id === dbTopic.category)?.name || dbTopic.category}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                ))}
                {filteredTopics.length === 0 && !loading && (
                  <div className="text-center py-4 text-gray-500">
                    {searchKeyword ? 'No topics found matching your search.' : 'No topics available in this category.'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Custom Topic Section */}
          {showAddTopic && (
            <Card className="border-dashed">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Add New Topic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customTopic">Topic Statement</Label>
                  <Input
                    id="customTopic"
                    placeholder="Enter new debate topic"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the topic"
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCustomTopic}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Add & Use Topic
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSuggestTopic}
                    disabled={loading}
                    className="flex-1"
                  >
                    Suggest for Review
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddTopic(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Position Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>My Position</Label>
              <Select value={userPosition} onValueChange={(value: 'for' | 'against') => setUserPosition(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for">In Favor</SelectItem>
                  <SelectItem value="against">Against</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>First Speaker</Label>
              <Select value={firstSpeaker} onValueChange={(value: 'user' | 'ai') => setFirstSpeaker(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">I speak first</SelectItem>
                  <SelectItem value="ai">AI speaks first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={handleStartDebate}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            Begin Instant Debate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDebateSetup;
