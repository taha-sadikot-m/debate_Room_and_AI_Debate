import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import HumanDebateHistoryService from '../services/humanDebateHistoryService';
import { EnhancedDebateHistoryService } from '../services/enhancedDebateHistoryService';
import { TemporaryDebateHistoryService } from '../services/temporaryDebateHistoryService';
import DebateHistorySetup from '../utils/debateHistorySetup';
import type { HumanDebateRecord } from '../types/debate';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Users, 
  Filter, 
  Search, 
  Eye, 
  User, 
  Clock,
  Download,
  Share2,
  Trash2,
  Copy,
  Archive,
  ChevronDown,
  ChevronUp,
  MapPin,
  Award,
  Target,
  Database,
  RefreshCw,
  HardDrive,
  Trophy
} from 'lucide-react';

interface HumanDebateHistoryProps {
  onBack: () => void;
  onNewDebate: () => void;
  onViewDebate?: (debate: HumanDebateRecord) => void;
}

const HumanDebateHistory = ({ onBack, onNewDebate, onViewDebate }: HumanDebateHistoryProps) => {
  const [debates, setDebates] = useState<HumanDebateRecord[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<HumanDebateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration' | 'participants'>('newest');
  const [filterByRole, setFilterByRole] = useState<'all' | 'host' | 'participant' | 'observer'>('all');
  const [filterByStatus, setFilterByStatus] = useState<'all' | 'completed' | 'active' | 'waiting'>('all');
  const [selectedDebate, setSelectedDebate] = useState<HumanDebateRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDebate, setExpandedDebate] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'enhanced' | 'legacy' | 'temporary'>('temporary');
  const [syncing, setSyncing] = useState(false);
  const [storageStats, setStorageStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDebateHistory();
    loadStorageStats();
  }, [dataSource]);

  useEffect(() => {
    filterAndSortDebates();
  }, [debates, searchTerm, sortBy, filterByRole, filterByStatus]);

  const loadDebateHistory = async () => {
    setIsLoading(true);
    try {
      let debateRecords: HumanDebateRecord[] = [];
      
      if (dataSource === 'enhanced') {
        // Use enhanced service
        debateRecords = await EnhancedDebateHistoryService.getUserDebateHistory();
      } else if (dataSource === 'temporary') {
        // Use temporary service
        TemporaryDebateHistoryService.initialize();
        debateRecords = await TemporaryDebateHistoryService.getAllDebates();
      } else {
        // Use legacy service
        debateRecords = await HumanDebateHistoryService.getUserDebateHistory();
      }
      
      setDebates(debateRecords);
      console.log(`📚 Loaded ${debateRecords.length} debates from ${dataSource} storage`);
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

  const loadStorageStats = () => {
    try {
      let stats;
      if (dataSource === 'temporary') {
        stats = TemporaryDebateHistoryService.getStorageStats();
      } else {
        stats = EnhancedDebateHistoryService.getStorageStats();
      }
      setStorageStats(stats);
    } catch (error) {
      console.error('Error loading storage stats:', error);
    }
  };

  const syncToDatabase = async () => {
    setSyncing(true);
    try {
      if (dataSource === 'enhanced') {
        // For enhanced service, we could implement database sync later
        toast({
          title: "Enhanced Storage Active",
          description: "Using enhanced local storage with backup capabilities.",
          variant: "default"
        });
      } else {
        await HumanDebateHistoryService.syncLocalStorageToDatabase();
        toast({
          title: "Sync complete",
          description: "Local debate history has been synced to the database.",
          variant: "default"
        });
      }
      
      // Refresh data
      await loadDebateHistory();
      loadStorageStats();
    } catch (error) {
      console.error('Error syncing to database:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync data to database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const filterAndSortDebates = () => {
    let filtered = [...debates];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(debate =>
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (filterByRole !== 'all') {
      filtered = filtered.filter(debate => {
        const currentUserId = 'current_user'; // This should come from auth context
        
        if (filterByRole === 'host') {
          return debate.hostName === currentUserId;
        } else if (filterByRole === 'participant') {
          return debate.participants.some(p => 
            p.id === currentUserId && 
            (p.side === 'FOR' || p.side === 'AGAINST')
          );
        } else if (filterByRole === 'observer') {
          return debate.participants.some(p => 
            p.id === currentUserId && 
            (p.side === 'OBSERVER' || p.side === 'EVALUATOR')
          );
        }
        return true;
      });
    }

    // Status filter
    if (filterByStatus !== 'all') {
      filtered = filtered.filter(debate => debate.status === filterByStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration':
          const aDuration = a.endedAt ? new Date(a.endedAt).getTime() - new Date(a.createdAt).getTime() : 0;
          const bDuration = b.endedAt ? new Date(b.endedAt).getTime() - new Date(b.createdAt).getTime() : 0;
          return bDuration - aDuration;
        case 'participants':
          return b.participants.length - a.participants.length;
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

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Ongoing';
    
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getSideStats = (debate: HumanDebateRecord) => {
    const forCount = debate.participants.filter(p => p.side === 'FOR').length;
    const againstCount = debate.participants.filter(p => p.side === 'AGAINST').length;
    const observerCount = debate.participants.filter(p => p.side === 'OBSERVER').length;
    const evaluatorCount = debate.participants.filter(p => p.side === 'EVALUATOR').length;
    
    return { forCount, againstCount, observerCount, evaluatorCount };
  };

  const exportDebate = (debate: HumanDebateRecord) => {
    const exportData = {
      topic: debate.topic,
      host: debate.hostName,
      participants: debate.participants,
      messages: debate.messages,
      createdAt: debate.createdAt,
      endedAt: debate.endedAt,
      duration: formatDuration(debate.createdAt, debate.endedAt),
      winner: debate.winner,
      statistics: getSideStats(debate)
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `debate_${debate.roomId}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: 'Export Complete',
      description: 'Debate data has been exported successfully.',
    });
  };

  const shareDebate = async (debate: HumanDebateRecord) => {
    const shareText = `Check out this debate: "${debate.topic}"\n\nParticipants: ${debate.participants.length}\nMessages: ${debate.messages.length}\nDuration: ${formatDuration(debate.createdAt, debate.endedAt)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Debate: ${debate.topic}`,
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied to Clipboard',
        description: 'Debate summary has been copied to your clipboard.',
      });
    }
  };

  const deleteDebate = async (debate: HumanDebateRecord) => {
    try {
      if (dataSource === 'enhanced') {
        // For enhanced storage, we would need to implement deletion
        // For now, remove from legacy storage if it exists
        localStorage.removeItem(`debate_room_${debate.roomId}_messages`);
        localStorage.removeItem(`debate_room_${debate.roomId}_participants`);
        localStorage.removeItem(`debate_room_${debate.roomId}_info`);
        localStorage.removeItem(`enhanced_debate_${debate.id}`);
        
        // Update index
        const index = JSON.parse(localStorage.getItem('enhanced_debate_index') || '[]');
        const updatedIndex = index.filter((entry: any) => entry.id !== debate.id);
        localStorage.setItem('enhanced_debate_index', JSON.stringify(updatedIndex));
      } else {
        // Legacy deletion
        localStorage.removeItem(`debate_room_${debate.roomId}_messages`);
        localStorage.removeItem(`debate_room_${debate.roomId}_participants`);
        localStorage.removeItem(`debate_room_${debate.roomId}_info`);
      }
      
      // Reload data and stats
      await loadDebateHistory();
      loadStorageStats();
      
      toast({
        title: 'Debate Deleted',
        description: 'The debate has been removed from your history.',
      });
    } catch (error) {
      console.error('Error deleting debate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete debate. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debate history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Hub
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Debate History</h1>
              <p className="text-gray-600 mt-1">
                Review your past debates and conversations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Data Source Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
              <Button
                variant={dataSource === 'enhanced' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDataSource('enhanced')}
                className="flex items-center gap-1"
              >
                <HardDrive size={14} />
                Enhanced
              </Button>
              <Button
                variant={dataSource === 'temporary' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDataSource('temporary')}
                className="flex items-center gap-1"
              >
                <Trophy size={14} />
                Temporary
              </Button>
              <Button
                variant={dataSource === 'legacy' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDataSource('legacy')}
                className="flex items-center gap-1"
              >
                <Database size={14} />
                Legacy
              </Button>
            </div>

            {/* Storage Stats */}
            {storageStats && (
              <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                {storageStats.totalDebates} debates • {storageStats.storageSize}
              </div>
            )}
            
            {/* Sync Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={syncToDatabase}
              disabled={syncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync to DB'}
            </Button>
          </div>
        </div>

        {/* Temporary Storage Info Banner */}
        {dataSource === 'temporary' && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Temporary Storage Active</h3>
                    <p className="text-sm text-blue-700">
                      Your debate history is stored locally using our enhanced temporary system. 
                      Data can be exported as JSON and will be migrated to the database when available.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => TemporaryDebateHistoryService.downloadJSON()}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await DebateHistorySetup.createRichSampleData();
                      loadDebateHistory();
                      toast({
                        title: 'Rich Sample Data Created',
                        description: 'Detailed sample debates with realistic conversations have been added'
                      });
                    }}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Add Rich Samples
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await DebateHistorySetup.quickSetup();
                      loadDebateHistory();
                      toast({
                        title: 'Quick Setup Complete',
                        description: 'System initialized with migration and sample data'
                      });
                    }}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Quick Setup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with New Debate Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Debates</h2>
            <p className="text-gray-600">Browse and search through your debate history</p>
          </div>
          <Button onClick={onNewDebate} className="flex items-center gap-2">
            <Users size={20} />
            New Debate
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Debates</p>
                  <p className="text-2xl font-bold text-gray-900">{debates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {debates.filter(d => d.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {debates.reduce((sum, d) => sum + d.participants.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {debates.reduce((sum, d) => sum + d.messages.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search debates, topics, or participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
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
                
                <Select value={filterByRole} onValueChange={(value: any) => setFilterByRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="observer">Observer</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="participants">Participants</SelectItem>
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
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Debates Found</h3>
              <p className="text-gray-500 mb-6">
                {debates.length === 0 
                  ? "You haven't participated in any debates yet." 
                  : "No debates match your current filters."}
              </p>
              <Button onClick={onNewDebate} className="flex items-center gap-2 mx-auto">
                <Users size={20} />
                Start Your First Debate
              </Button>
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
                          <Badge 
                            variant={debate.status === 'completed' ? 'default' : 
                                   debate.status === 'active' ? 'secondary' : 'outline'}
                          >
                            {debate.status}
                          </Badge>
                          {debate.winner && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Trophy size={12} />
                              {debate.winner} Won
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User size={14} />
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
                            {stats.evaluatorCount > 0 && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                EVALUATORS: {stats.evaluatorCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {debate.tags && debate.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {debate.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedDebate(isExpanded ? null : debate.id)}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Quick Actions</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-3">
                              <Button 
                                variant="outline" 
                                onClick={() => onViewDebate?.(debate)}
                                className="flex items-center gap-2"
                              >
                                <Eye size={16} />
                                View Details
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => exportDebate(debate)}
                                className="flex items-center gap-2"
                              >
                                <Download size={16} />
                                Export
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => shareDebate(debate)}
                                className="flex items-center gap-2"
                              >
                                <Share2 size={16} />
                                Share
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => deleteDebate(debate)}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold mb-2">Participants</h4>
                            <div className="space-y-1">
                              {debate.participants.map((participant) => (
                                <div key={participant.id} className="flex items-center justify-between">
                                  <span>{participant.name}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      participant.side === 'FOR' ? 'bg-green-50 text-green-700 border-green-200' :
                                      participant.side === 'AGAINST' ? 'bg-red-50 text-red-700 border-red-200' :
                                      participant.side === 'OBSERVER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      'bg-purple-50 text-purple-700 border-purple-200'
                                    }
                                  >
                                    {participant.side}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Recent Messages</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {debate.messages.slice(-3).map((message) => (
                                <div key={message.id} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="font-medium">{message.senderName}</div>
                                  <div className="text-gray-600 line-clamp-2">{message.text}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {debate.moderatorNotes && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Moderator Notes</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {debate.moderatorNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanDebateHistory;
