import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, MessageSquare, Trophy, Filter, Search, Eye } from 'lucide-react';

interface Message {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface DebateEvaluation {
  score: number;
  breakdown: {
    logical_consistency: number;
    evidence_quality: number;
    rebuttal_effectiveness: number;
    persuasiveness: number;
    rhetorical_skill: number;
  };
  strengths: string[];
  improvements: string[];
  argument_analysis: {
    argument: string;
    feedback: string;
    suggestion: string;
  }[];
  final_remarks: string;
}

interface DebateRecord {
  id: string;
  topic: string;
  userPosition: 'for' | 'against';
  aiPosition: 'for' | 'against';
  messages: Message[];
  createdAt: Date;
  evaluation?: DebateEvaluation;
}

interface InstantDebateHistoryProps {
  onBack: () => void;
  onViewDebate: (debate: DebateRecord) => void;
  onNewDebate: () => void;
}

const InstantDebateHistory = ({ onBack, onViewDebate, onNewDebate }: InstantDebateHistoryProps) => {
  const [debates, setDebates] = useState<DebateRecord[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<DebateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('newest');
  const [filterByPosition, setFilterByPosition] = useState<'all' | 'for' | 'against'>('all');

  useEffect(() => {
    loadDebateHistory();
  }, []);

  useEffect(() => {
    filterAndSortDebates();
  }, [debates, searchTerm, sortBy, filterByPosition]);

  const loadDebateHistory = () => {
    const savedDebates = JSON.parse(localStorage.getItem('instant_debates') || '[]');
    // Convert date strings back to Date objects
    const debatesWithDates = savedDebates.map((debate: any) => ({
      ...debate,
      createdAt: new Date(debate.createdAt),
      messages: debate.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
    setDebates(debatesWithDates);
  };

  const filterAndSortDebates = () => {
    let filtered = [...debates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(debate =>
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by position
    if (filterByPosition !== 'all') {
      filtered = filtered.filter(debate => debate.userPosition === filterByPosition);
    }

    // Sort debates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'score':
          const scoreA = a.evaluation?.score || 0;
          const scoreB = b.evaluation?.score || 0;
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

  const getPositionBadge = (position: 'for' | 'against') => {
    return position === 'for' 
      ? { text: 'In Favor', color: 'bg-green-100 text-green-800' }
      : { text: 'Against', color: 'bg-red-100 text-red-800' };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all debate history? This action cannot be undone.')) {
      localStorage.removeItem('instant_debates');
      setDebates([]);
      setFilteredDebates([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 Instant Debate</h1>
          <p className="text-gray-600 mt-2">Practice your debate skills with AI • Review your past debates • Track your progress</p>
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

      {/* Stats Cards */}
      {debates.length > 0 && (
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
                {debates.filter(d => d.evaluation && d.evaluation.score >= 80).length}
              </div>
              <div className="text-sm text-gray-600">High Scores (80+)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {debates.filter(d => d.userPosition === 'for').length}
              </div>
              <div className="text-sm text-gray-600">Argued For</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(debates.reduce((acc, d) => acc + (d.evaluation?.score || 0), 0) / Math.max(debates.length, 1))}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions for existing users */}
      {debates.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready for another debate? 🎯</h3>
                <p className="text-gray-600">Challenge yourself with a new topic and improve your skills!</p>
              </div>
              <Button onClick={onNewDebate} className="bg-blue-500 hover:bg-blue-600 text-lg px-6 py-3">
                🚀 Start New Debate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
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

      {/* Debate List */}
      {filteredDebates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              {debates.length === 0 ? 'Welcome to Instant Debate! 🎯' : 'No Debates Match Your Filters'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {debates.length === 0 
                ? 'Practice your debate skills by arguing with our advanced AI. Choose any topic, pick your position, and start debating instantly!' 
                : 'Try adjusting your search or filter criteria to find the debates you\'re looking for.'
              }
            </p>
            {debates.length === 0 && (
              <div className="space-y-4">
                <Button onClick={onNewDebate} className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-3">
                  🚀 Start Your First Debate
                </Button>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>💡 Tips: You can debate any topic you want!</p>
                  <p>🎭 Choose to argue for or against your position</p>
                  <p>📊 Get detailed AI evaluation after each debate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDebates.map((debate) => {
            const scoreBadge = getScoreBadge(debate.evaluation?.score);
            const positionBadge = getPositionBadge(debate.userPosition);
            const messageCount = debate.messages.length;
            const userMessageCount = debate.messages.filter(m => m.speaker === 'user').length;

            return (
              <Card key={debate.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {debate.topic}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={positionBadge.color}>
                              {positionBadge.text}
                            </Badge>
                            <Badge className={scoreBadge.color}>
                              {debate.evaluation ? `${debate.evaluation.score}/100` : 'No Score'}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDebate(debate)}
                          className="ml-4"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(debate.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{messageCount} messages ({userMessageCount} yours)</span>
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
      {debates.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button variant="destructive" onClick={clearHistory}>
            Clear All History
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstantDebateHistory;
