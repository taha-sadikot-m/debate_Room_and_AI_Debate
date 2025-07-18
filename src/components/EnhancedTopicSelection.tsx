import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Zap, 
  Search, 
  Users, 
  Bot, 
  Target,
  Trophy,
  Clock,
  Star,
  Loader2,
  Play,
  Settings
} from 'lucide-react';
import { DebateConfig, DebateTopic, TOPIC_CATEGORIES } from '@/types/debate';
import { TopicService } from '@/services/topicService';
import AdvancedTopicManager from './AdvancedTopicManager';

interface EnhancedTopicSelectionProps {
  onStartDebate: (config: DebateConfig) => void;
  onBack: () => void;
}

interface QuickTopic {
  id: string;
  topic: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  trending?: boolean;
}

const EnhancedTopicSelection = ({ onStartDebate, onBack }: EnhancedTopicSelectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');
  const [debateMode, setDebateMode] = useState<'ai' | 'human'>('ai');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [activeTab, setActiveTab] = useState<'quick' | 'browse' | 'custom'>('quick');
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  // Quick start topics - trending and popular ones
  const quickTopics: QuickTopic[] = [
    {
      id: '1',
      topic: 'Should artificial intelligence be regulated by government?',
      category: 'technology',
      difficulty: 'medium',
      description: 'Debate the role of government in AI regulation',
      trending: true
    },
    {
      id: '2',
      topic: 'Is social media doing more harm than good to society?',
      category: 'technology',
      difficulty: 'easy',
      description: 'Explore the societal impact of social platforms'
    },
    {
      id: '3',
      topic: 'Should university education be free for everyone?',
      category: 'education',
      difficulty: 'medium',
      description: 'Discuss accessibility and funding of higher education'
    },
    {
      id: '4',
      topic: 'Is nuclear energy the key to solving climate change?',
      category: 'environment',
      difficulty: 'hard',
      description: 'Analyze nuclear power as a climate solution'
    },
    {
      id: '5',
      topic: 'Should there be a universal basic income?',
      category: 'economics',
      difficulty: 'hard',
      description: 'Debate the economic implications of UBI',
      trending: true
    },
    {
      id: '6',
      topic: 'Is remote work better than office work?',
      category: 'culture',
      difficulty: 'easy',
      description: 'Compare remote vs traditional work environments'
    }
  ];

  const handleTopicSelect = (topic: string, category: string) => {
    setSelectedTopic(topic);
    setSelectedCategory(category);
    setActiveTab('custom'); // Switch to setup tab
  };

  const handleQuickStart = (quickTopic: QuickTopic) => {
    const config: DebateConfig = {
      topic: quickTopic.topic,
      userPosition,
      firstSpeaker,
      difficulty: quickTopic.difficulty,
      category: quickTopic.category,
      opponent: debateMode === 'ai' ? {
        id: 'ai-opponent',
        name: 'AI Debater',
        level: quickTopic.difficulty,
        type: 'ai'
      } : undefined
    };

    onStartDebate(config);
  };

  const handleCustomStart = () => {
    const topicToUse = selectedTopic || customTopic;
    
    if (!topicToUse.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter or select a debate topic.",
        variant: "destructive",
      });
      return;
    }

    const config: DebateConfig = {
      topic: topicToUse.trim(),
      userPosition,
      firstSpeaker,
      difficulty,
      category: selectedCategory || 'general',
      opponent: debateMode === 'ai' ? {
        id: 'ai-opponent',
        name: 'AI Debater',
        level: difficulty,
        type: 'ai'
      } : undefined
    };

    onStartDebate(config);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="h-8 w-8 text-blue-500 mr-3" />
            Choose Your Debate
          </h1>
          <p className="text-gray-600 mt-2">Select a topic, set your preferences, and start debating</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Debate Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${
                debateMode === 'ai' 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDebateMode('ai')}
            >
              <CardContent className="p-4 text-center">
                <Bot className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">AI Opponent</h3>
                <p className="text-sm text-gray-600">Debate with advanced AI</p>
                <Badge className="mt-2 bg-green-100 text-green-700">Instant Start</Badge>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all ${
                debateMode === 'human' 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDebateMode('human')}
            >
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">Human Opponent</h3>
                <p className="text-sm text-gray-600">Debate with real people</p>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Find Opponent</Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Quick Start</TabsTrigger>
          <TabsTrigger value="browse">Browse Topics</TabsTrigger>
          <TabsTrigger value="custom">Custom Setup</TabsTrigger>
        </TabsList>

        {/* Quick Start Tab */}
        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Start Topics
              </CardTitle>
              <p className="text-gray-600">Popular topics to get you debating instantly</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(topic.category)}>
                            {TOPIC_CATEGORIES.find(c => c.id === topic.category)?.name}
                          </Badge>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty}
                          </Badge>
                        </div>
                        {topic.trending && (
                          <Badge className="bg-orange-100 text-orange-700 flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-sm mb-2 leading-tight">
                        {topic.topic}
                      </h3>
                      
                      <p className="text-xs text-gray-600 mb-3">
                        {topic.description}
                      </p>
                      
                      <Button
                        onClick={() => handleQuickStart(topic)}
                        size="sm"
                        className="w-full"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Debate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Topics Tab */}
        <TabsContent value="browse" className="space-y-6">
          <AdvancedTopicManager
            onTopicSelect={handleTopicSelect}
            onCreateDebate={onStartDebate}
            selectedTopic={selectedTopic}
            selectedCategory={selectedCategory}
          />
        </TabsContent>

        {/* Custom Setup Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Debate Setup</CardTitle>
              <p className="text-gray-600">Customize every aspect of your debate</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Selection */}
              <div className="space-y-3">
                <Label>Debate Topic</Label>
                {selectedTopic ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{selectedTopic}</p>
                        {selectedCategory && (
                          <Badge className={`mt-1 ${getCategoryColor(selectedCategory)}`}>
                            {TOPIC_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTopic('');
                          setSelectedCategory('');
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    placeholder="Enter your custom debate topic..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="text-lg p-4"
                  />
                )}
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Your Position</Label>
                  <Select value={userPosition} onValueChange={(value: 'for' | 'against') => setUserPosition(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for">✅ In Favor</SelectItem>
                      <SelectItem value="against">❌ Against</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>First Speaker</Label>
                  <Select value={firstSpeaker} onValueChange={(value: 'user' | 'ai') => setFirstSpeaker(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">I speak first</SelectItem>
                      <SelectItem value="ai">Opponent speaks first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy - Casual debate</SelectItem>
                      <SelectItem value="medium">🟡 Medium - Standard debate</SelectItem>
                      <SelectItem value="hard">🔴 Hard - Advanced debate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              </div>

              {/* Start Button */}
              <Button
                onClick={handleCustomStart}
                disabled={loading}
                size="lg"
                className="w-full bg-blue-500 hover:bg-blue-600 text-lg py-6"
              >
                {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                <Play className="h-5 w-5 mr-2" />
                {debateMode === 'ai' ? 'Start AI Debate' : 'Find Human Opponent'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTopicSelection;
