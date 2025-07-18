import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Trophy, 
  Filter, 
  Search, 
  Eye, 
  User, 
  Bot,
  Download,
  Share2,
  Trash2,
  TrendingUp,
  Clock,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TopicService } from '@/services/topicService';
import { DetailedDebateRecord, DebateMessage } from '@/types/debate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DebateHistoryViewerProps {
  onBack: () => void;
  onNewDebate: () => void;
}

const DebateHistoryViewer = ({ onBack, onNewDebate }: DebateHistoryViewerProps) => {
  const [debates, setDebates] = useState<DetailedDebateRecord[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<DetailedDebateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('newest');
  const [filterByPosition, setFilterByPosition] = useState<'all' | 'for' | 'against'>('all');
  const [selectedDebate, setSelectedDebate] = useState<DetailedDebateRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDebateHistory();
  }, []);

  useEffect(() => {
    filterAndSortDebates();
  }, [debates, searchTerm, sortBy, filterByPosition]);

  const loadDebateHistory = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your debate history.",
          variant: "destructive",
        });
        return;
      }

      const debateHistory = await TopicService.getDetailedDebateHistory(user.user.id);
      setDebates(debateHistory);
    } catch (error) {
      console.error('Error loading debate history:', error);
      toast({
        title: "Error",
        description: "Failed to load debate history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortDebates = () => {
    let filtered = [...debates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(debate =>
        debate.session.topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by position
    if (filterByPosition !== 'all') {
      filtered = filtered.filter(debate => debate.session.user_position === filterByPosition);
    }

    // Sort debates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.session.created_at || '').getTime() - new Date(a.session.created_at || '').getTime();
        case 'oldest':
          return new Date(a.session.created_at || '').getTime() - new Date(b.session.created_at || '').getTime();
        case 'score':
          const scoreA = a.evaluation?.overall_score || 0;
          const scoreB = b.evaluation?.overall_score || 0;
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    setFilteredDebates(filtered);
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return { text: 'No Score', color: 'bg-gray-100 text-gray-800' };
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  const getPositionBadge = (position?: 'for' | 'against') => {
    if (!position) return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    return position === 'for' 
      ? { text: 'In Favor', color: 'bg-green-100 text-green-800' }
      : { text: 'Against', color: 'bg-red-100 text-red-800' };
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const exportDebate = (debate: DetailedDebateRecord) => {
    const transcript = debate.messages
      .map(msg => `${msg.speaker.toUpperCase()}: ${msg.message_text}`)
      .join('\n\n');

    const content = `DEBATE TRANSCRIPT
================================

Topic: ${debate.session.topic}
Date: ${formatDate(debate.session.created_at || '')}
Your Position: ${debate.session.user_position?.toUpperCase() || 'Unknown'}
AI Position: ${debate.session.ai_position?.toUpperCase() || 'Unknown'}
Duration: ${formatDuration(debate.session.duration_seconds)}

CONVERSATION:
${transcript}

${debate.evaluation ? `
EVALUATION:
Score: ${debate.evaluation.overall_score}/100

STRENGTHS:
${debate.evaluation.strengths.map(s => `• ${s}`).join('\n')}

IMPROVEMENTS:
${debate.evaluation.improvements.map(i => `• ${i}`).join('\n')}

FINAL REMARKS:
${debate.evaluation.final_remarks || 'No final remarks provided.'}
` : ''}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-${debate.session.topic.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date(debate.session.created_at || '').toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareDebate = async (debate: DetailedDebateRecord) => {
    const text = `Just completed a debate on "${debate.session.topic}" and scored ${debate.evaluation?.overall_score || 'N/A'}/100! 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Debate Performance',
          text: text,
        });
      } catch (error) {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Shared!",
          description: "Debate summary copied to clipboard!",
        });
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Shared!",
        description: "Debate summary copied to clipboard!",
      });
    }
  };

  const deleteDebate = async (debate: DetailedDebateRecord) => {
    if (!window.confirm('Are you sure you want to delete this debate? This action cannot be undone.')) {
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const success = await TopicService.deleteDebateSession(debate.session.id!, user.user.id);
      if (success) {
        setDebates(prev => prev.filter(d => d.session.id !== debate.session.id));
        toast({
          title: "Deleted",
          description: "Debate has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete debate. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting debate:', error);
      toast({
        title: "Error",
        description: "Failed to delete debate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all debate history? This action cannot be undone.')) {
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Delete all debates for the user
      const deletePromises = debates.map(debate => 
        TopicService.deleteDebateSession(debate.session.id!, user.user.id)
      );
      
      await Promise.all(deletePromises);
      setDebates([]);
      setFilteredDebates([]);
      
      toast({
        title: "Cleared",
        description: "All debate history has been cleared.",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  const MessageBubble = ({ message }: { message: DebateMessage }) => {
    const isUser = message.speaker === 'user';
    const isExpanded = expandedMessage === message.id;
    const shouldTruncate = message.message_text.length > 200;

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            <span className="text-xs font-medium">
              {isUser ? 'You' : 'AI'}
            </span>
            <span className="text-xs opacity-70">
              {message.timestamp ? formatDate(message.timestamp) : ''}
            </span>
          </div>
          <div className="text-sm">
            {shouldTruncate && !isExpanded ? (
              <>
                {message.message_text.substring(0, 200)}...
                <button
                  onClick={() => toggleMessageExpansion(message.id!)}
                  className="ml-2 text-xs underline opacity-70 hover:opacity-100"
                >
                  <ChevronDown className="h-3 w-3 inline" />
                  Show more
                </button>
              </>
            ) : (
              <>
                {message.message_text}
                {shouldTruncate && isExpanded && (
                  <button
                    onClick={() => toggleMessageExpansion(message.id!)}
                    className="ml-2 text-xs underline opacity-70 hover:opacity-100"
                  >
                    <ChevronUp className="h-3 w-3 inline" />
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Debate History</h1>
          <p className="text-gray-600 mt-2">Review your past debates and track your progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={onNewDebate} className="bg-blue-500 hover:bg-blue-600 text-lg px-6 py-3">
            🚀 Start New Debate
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your debate history...</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {!isLoading && debates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{debates.length}</div>
              <div className="text-sm text-gray-600">Total Debates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {debates.filter(d => d.evaluation && d.evaluation.overall_score >= 80).length}
              </div>
              <div className="text-sm text-gray-600">High Scores (80+)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {debates.filter(d => d.session.user_position === 'for').length}
              </div>
              <div className="text-sm text-gray-600">Argued For</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(debates.reduce((acc, d) => acc + (d.evaluation?.overall_score || 0), 0) / Math.max(debates.length, 1))}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      {!isLoading && debates.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search debates by topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="score">High Score</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterByPosition} onValueChange={(value: any) => setFilterByPosition(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="for">In Favor</SelectItem>
                    <SelectItem value="against">Against</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debate List */}
      {!isLoading && filteredDebates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              {debates.length === 0 ? 'No Debates Yet! 🎯' : 'No Debates Match Your Filters'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {debates.length === 0 
                ? 'Start your first debate to see your history here. Track your progress and review past conversations!' 
                : 'Try adjusting your search or filter criteria to find the debates you\'re looking for.'
              }
            </p>
            {debates.length === 0 && (
              <Button onClick={onNewDebate} className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-3">
                🚀 Start Your First Debate
              </Button>
            )}
          </CardContent>
        </Card>
      ) : !isLoading && (
        <div className="space-y-4">
          {filteredDebates.map((debate) => {
            const scoreBadge = getScoreBadge(debate.evaluation?.overall_score);
            const positionBadge = getPositionBadge(debate.session.user_position);
            const messageCount = debate.messages.length;
            const userMessageCount = debate.messages.filter(m => m.speaker === 'user').length;

            return (
              <Card key={debate.session.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {debate.session.topic}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={positionBadge.color}>
                              {positionBadge.text}
                            </Badge>
                            <Badge className={scoreBadge.color}>
                              {debate.evaluation ? `${debate.evaluation.overall_score}/100` : 'No Score'}
                            </Badge>
                            <Badge variant="outline">
                              {debate.session.debate_type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDebate(debate)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>{debate.session.topic}</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-4">
                                  {/* Debate Info */}
                                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                      <div className="text-sm text-gray-600">Your Position</div>
                                      <div className="font-medium">{debate.session.user_position?.toUpperCase() || 'Unknown'}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-600">AI Position</div>
                                      <div className="font-medium">{debate.session.ai_position?.toUpperCase() || 'Unknown'}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-600">Date</div>
                                      <div className="font-medium">{formatDate(debate.session.created_at || '')}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-600">Duration</div>
                                      <div className="font-medium">{formatDuration(debate.session.duration_seconds)}</div>
                                    </div>
                                  </div>

                                  {/* Messages */}
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 mb-3">Conversation</h4>
                                    {debate.messages.map((message) => (
                                      <MessageBubble key={message.id} message={message} />
                                    ))}
                                  </div>

                                  {/* Evaluation */}
                                  {debate.evaluation && (
                                    <div className="space-y-3">
                                      <Separator />
                                      <h4 className="font-semibold text-gray-900">Evaluation</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <div className="text-sm text-gray-600 mb-2">Score</div>
                                          <div className="text-2xl font-bold text-blue-600">
                                            {debate.evaluation.overall_score}/100
                                          </div>
                                        </div>
                                        {debate.evaluation.breakdown && Object.keys(debate.evaluation.breakdown).length > 0 && (
                                          <div>
                                            <div className="text-sm text-gray-600 mb-2">Breakdown</div>
                                            <div className="space-y-1">
                                              {Object.entries(debate.evaluation.breakdown).map(([key, value]) => (
                                                <div key={key} className="flex justify-between text-sm">
                                                  <span className="capitalize">{key.replace('_', ' ')}</span>
                                                  <span>{value}/10</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {debate.evaluation.strengths.length > 0 && (
                                        <div>
                                          <div className="text-sm text-gray-600 mb-2">Strengths</div>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            {debate.evaluation.strengths.map((strength, index) => (
                                              <li key={index}>{strength}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {debate.evaluation.improvements.length > 0 && (
                                        <div>
                                          <div className="text-sm text-gray-600 mb-2">Areas for Improvement</div>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            {debate.evaluation.improvements.map((improvement, index) => (
                                              <li key={index}>{improvement}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {debate.evaluation.final_remarks && (
                                        <div>
                                          <div className="text-sm text-gray-600 mb-2">Final Remarks</div>
                                          <p className="text-sm">{debate.evaluation.final_remarks}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportDebate(debate)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareDebate(debate)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDebate(debate)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(debate.session.created_at || '')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{messageCount} messages ({userMessageCount} yours)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(debate.session.duration_seconds)}</span>
                        </div>
                        {debate.evaluation && (
                          <div className="flex items-center space-x-1">
                            <Trophy className="h-4 w-4" />
                            <span>Evaluated</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {!isLoading && debates.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button variant="destructive" onClick={clearAllHistory}>
            Clear All History
          </Button>
        </div>
      )}
    </div>
  );
};

export default DebateHistoryViewer;
