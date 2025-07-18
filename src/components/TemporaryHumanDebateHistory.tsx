import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Users, 
  Clock, 
  Trophy, 
  Search, 
  Filter,
  Download,
  Settings,
  Eye,
  Info,
  RefreshCw,
  Database
} from 'lucide-react';
import { TemporaryDebateHistoryService } from '@/services/temporaryDebateHistoryService';
import { DebateHistoryManager } from './DebateHistoryManager';
import type { HumanDebateRecord } from '@/types/debate';
import { useToast } from '@/components/ui/use-toast';

interface TemporaryHumanDebateHistoryProps {
  onBack: () => void;
  onNewDebate: () => void;
  onViewDebate: (debate: HumanDebateRecord) => void;
}

const TemporaryHumanDebateHistory = ({ onBack, onNewDebate, onViewDebate }: TemporaryHumanDebateHistoryProps) => {
  const [debates, setDebates] = useState<HumanDebateRecord[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<HumanDebateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'topic'>('newest');
  const [filterByRole, setFilterByRole] = useState<'all' | 'FOR' | 'AGAINST' | 'OBSERVER'>('all');
  const [filterByStatus, setFilterByStatus] = useState<'all' | 'completed' | 'active' | 'waiting'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDebate, setExpandedDebate] = useState<string | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDebateHistory();
    loadStats();
  }, []);

  useEffect(() => {
    filterAndSortDebates();
  }, [debates, searchTerm, sortBy, filterByRole, filterByStatus]);

  const loadDebateHistory = async () => {
    setIsLoading(true);
    try {
      TemporaryDebateHistoryService.initialize();
      const debateRecords = await TemporaryDebateHistoryService.getAllDebates();
      setDebates(debateRecords);
      console.log(`📚 Loaded ${debateRecords.length} debates from temporary storage`);
    } catch (error) {
      console.error('Error loading debate history:', error);
      toast({
        title: 'Error Loading History',
        description: 'Failed to load debate history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const storageStats = TemporaryDebateHistoryService.getStorageStats();
      setStats(storageStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterAndSortDebates = () => {
    let filtered = [...debates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(debate =>
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by role
    if (filterByRole !== 'all') {
      filtered = filtered.filter(debate =>
        debate.participants.some(p => p.side === filterByRole)
      );
    }

    // Filter by status
    if (filterByStatus !== 'all') {
      filtered = filtered.filter(debate => debate.status === filterByStatus);
    }

    // Sort debates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'topic':
          return a.topic.localeCompare(b.topic);
        default:
          return 0;
      }
    });

    setFilteredDebates(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Ongoing';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end.getTime() - start.getTime()) / 60000);
    return `${duration} min`;
  };

  const getSideStats = (debate: HumanDebateRecord) => {
    const forCount = debate.participants.filter(p => p.side === 'FOR').length;
    const againstCount = debate.participants.filter(p => p.side === 'AGAINST').length;
    const observerCount = debate.participants.filter(p => p.side === 'OBSERVER').length;
    const evaluatorCount = debate.participants.filter(p => p.side === 'EVALUATOR').length;
    
    return { forCount, againstCount, observerCount, evaluatorCount };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    loadDebateHistory();
    loadStats();
    toast({
      title: 'Refreshed',
      description: 'Debate history has been refreshed'
    });
  };

  const handleExport = () => {
    try {
      TemporaryDebateHistoryService.downloadJSON();
      toast({
        title: 'Export Complete',
        description: 'Debate history has been downloaded'
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export debate history',
        variant: 'destructive'
      });
    }
  };

  if (showManager) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <DebateHistoryManager 
          onClose={() => setShowManager(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏛️ Human Debate History</h1>
          <p className="text-gray-600 mt-2">
            Review your debate participation • Temporary storage system active
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={onNewDebate} className="bg-blue-500 hover:bg-blue-600">
            Start New Debate
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* System Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>Temporary Storage Active:</strong> Your debate history is stored locally and can be exported as JSON. 
            This will be migrated to the database when available.
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowManager(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      {stats && stats.totalDebates > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalDebates}</div>
              <div className="text-sm text-gray-600">Total Debates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-green-600">{stats.storageSize}</div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-bold text-purple-600">
                {stats.oldestDebate ? formatDate(stats.oldestDebate) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">First Debate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-bold text-orange-600">
                {stats.newestDebate ? formatDate(stats.newestDebate) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Latest Debate</div>
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
                  placeholder="Search debates, participants, or topics..."
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
                    <SelectItem value="topic">Topic</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterByRole} onValueChange={(value: any) => setFilterByRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="FOR">For</SelectItem>
                    <SelectItem value="AGAINST">Against</SelectItem>
                    <SelectItem value="OBSERVER">Observer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterByStatus} onValueChange={(value: any) => setFilterByStatus(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={debates.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your debate history...</p>
          </CardContent>
        </Card>
      )}

      {/* Debate List */}
      {!isLoading && (
        <>
          {filteredDebates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {debates.length === 0 ? 'No Debates Yet!' : 'No Debates Match Your Filters'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {debates.length === 0 
                    ? "You haven't participated in any debates yet. Start your first debate to see it here!" 
                    : "Try adjusting your search or filter criteria."}
                </p>
                <div className="space-y-4">
                  <Button onClick={onNewDebate} className="flex items-center gap-2 mx-auto">
                    <Users size={20} />
                    {debates.length === 0 ? 'Start Your First Debate' : 'Start New Debate'}
                  </Button>
                  {debates.length === 0 && (
                    <Button 
                      variant="outline" 
                      onClick={async () => {
                        await TemporaryDebateHistoryService.createSampleData();
                        loadDebateHistory();
                        toast({
                          title: 'Sample Data Created',
                          description: 'Sample debates have been added for testing'
                        });
                      }}
                    >
                      Add Sample Data
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDebates.map((debate) => {
                const stats = getSideStats(debate);
                const isExpanded = expandedDebate === debate.id;
                
                return (
                  <Card key={debate.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                              {debate.topic}
                            </h3>
                            <Badge className={getStatusColor(debate.status)}>
                              {debate.status}
                            </Badge>
                            {debate.winner && (
                              <Badge variant="outline" className="border-green-300 text-green-700">
                                Winner: {debate.winner}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              {debate.hostName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(debate.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {formatDuration(debate.createdAt, debate.endedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              {debate.participants.length} participants
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              {debate.messages.length} messages
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                FOR: {stats.forCount}
                              </Badge>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                AGAINST: {stats.againstCount}
                              </Badge>
                              {stats.observerCount > 0 && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  OBSERVERS: {stats.observerCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDebate(debate)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TemporaryHumanDebateHistory;
