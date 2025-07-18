import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, 
  Play, 
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  MessageSquare,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTemporaryDebateHistory } from '@/hooks/useTemporaryDebateHistory';
import type { HumanDebateRecord, ChatMessage } from '@/types/debate';
import { useToast } from '@/components/ui/use-toast';

interface TemporaryDebateHistoryDemoProps {
  onClose?: () => void;
}

/**
 * Demo Component for Temporary Debate History System
 * Shows how to use the temporary storage system and tests its functionality
 */
export const TemporaryDebateHistoryDemo: React.FC<TemporaryDebateHistoryDemoProps> = ({
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HumanDebateRecord[]>([]);
  const [newDebateTopic, setNewDebateTopic] = useState('');
  const [selectedDebateId, setSelectedDebateId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  
  const {
    debates,
    currentDebate,
    isLoading,
    stats,
    loadDebates,
    saveDebate,
    getDebateById,
    searchDebates,
    updateDebateStatus,
    addMessage,
    addParticipant,
    exportToJSON,
    downloadJSON,
    importFromJSON,
    createSampleData,
    clearAll,
    refreshStats
  } = useTemporaryDebateHistory({ autoLoad: true });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchDebates(searchQuery);
      setSearchResults(results);
      toast({
        title: 'Search Complete',
        description: `Found ${results.length} debates matching "${searchQuery}"`
      });
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Failed to search debates',
        variant: 'destructive'
      });
    }
  };

  const handleCreateDebate = async () => {
    if (!newDebateTopic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a debate topic',
        variant: 'destructive'
      });
      return;
    }

    const newDebate: HumanDebateRecord = {
      id: `demo_${Date.now()}`,
      roomId: `room_${Date.now()}`,
      topic: newDebateTopic,
      hostName: 'Demo User',
      participants: [
        {
          id: 'demo_user',
          name: 'Demo User',
          side: 'FOR',
          joinedAt: new Date().toISOString(),
          isActive: true,
          lastSeen: new Date().toISOString()
        }
      ],
      messages: [
        {
          id: 'welcome_msg',
          senderId: 'system',
          senderName: 'System',
          text: `Welcome to the debate: "${newDebateTopic}"`,
          side: 'OBSERVER',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      status: 'active',
      tags: ['demo', 'test']
    };

    try {
      const result = await saveDebate(newDebate);
      if (result) {
        setNewDebateTopic('');
        toast({
          title: 'Debate Created',
          description: `Debate "${newDebate.topic}" created successfully`
        });
      } else {
        throw new Error('Failed to save debate');
      }
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create debate',
        variant: 'destructive'
      });
    }
  };

  const handleAddMessage = async () => {
    if (!selectedDebateId || !newMessage.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a debate and enter a message',
        variant: 'destructive'
      });
      return;
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'demo_user',
      senderName: 'Demo User',
      text: newMessage,
      side: 'FOR',
      timestamp: new Date().toISOString()
    };

    try {
      const result = await addMessage(selectedDebateId, message);
      if (result) {
        setNewMessage('');
        toast({
          title: 'Message Added',
          description: 'Message added to debate successfully'
        });
      } else {
        throw new Error('Failed to add message');
      }
    } catch (error) {
      toast({
        title: 'Message Failed',
        description: 'Failed to add message',
        variant: 'destructive'
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await importFromJSON(text);
      toast({
        title: 'Import Complete',
        description: `Imported ${result.success} debates, ${result.failed} failed`
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import file',
        variant: 'destructive'
      });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all debate history? This cannot be undone.')) {
      return;
    }

    try {
      const result = await clearAll();
      if (result) {
        setSearchResults([]);
        setSelectedDebateId('');
        toast({
          title: 'History Cleared',
          description: 'All debate history has been cleared'
        });
      } else {
        throw new Error('Clear operation failed');
      }
    } catch (error) {
      toast({
        title: 'Clear Failed',
        description: 'Failed to clear history',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🧪 Temporary Debate History Demo
          </h1>
          <p className="text-gray-600 mt-2">
            Test the temporary storage system and its features
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Demo
          </Button>
        )}
      </div>

      {/* System Status */}
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              <strong>Temporary Storage Active:</strong> {stats?.totalDebates || 0} debates stored, 
              using {stats?.storageSize || '0 bytes'}
            </span>
            <Button variant="outline" size="sm" onClick={refreshStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Actions */}
        <div className="space-y-6">
          {/* Create New Debate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Test Debate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter debate topic..."
                value={newDebateTopic}
                onChange={(e) => setNewDebateTopic(e.target.value)}
              />
              <Button onClick={handleCreateDebate} className="w-full" disabled={!newDebateTopic.trim()}>
                Create Debate
              </Button>
            </CardContent>
          </Card>

          {/* Search Debates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Debates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search topics, participants, messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                  Search
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="text-sm text-gray-600">
                  Found {searchResults.length} results
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add Message to Debate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={selectedDebateId}
                onChange={(e) => setSelectedDebateId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a debate...</option>
                {debates.map(debate => (
                  <option key={debate.id} value={debate.id}>
                    {debate.topic}
                  </option>
                ))}
              </select>
              <Textarea
                placeholder="Enter your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleAddMessage} 
                className="w-full" 
                disabled={!selectedDebateId || !newMessage.trim()}
              >
                Add Message
              </Button>
            </CardContent>
          </Card>

          {/* System Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={createSampleData} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Sample Data
              </Button>
              
              <Button onClick={downloadJSON} variant="outline" className="w-full" disabled={debates.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-demo"
                />
                <label htmlFor="import-demo">
                  <Button as="span" variant="outline" className="w-full cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import from JSON
                  </Button>
                </label>
              </div>
              
              <Button onClick={handleClearAll} variant="destructive" className="w-full" disabled={debates.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Data Display */}
        <div className="space-y-6">
          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Storage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalDebates}</div>
                    <div className="text-sm text-gray-600">Total Debates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.storageSize}</div>
                    <div className="text-sm text-gray-600">Storage Used</div>
                  </div>
                </div>
                {stats.oldestDebate && (
                  <div className="mt-4 text-sm text-gray-600">
                    <div>Oldest: {new Date(stats.oldestDebate).toLocaleDateString()}</div>
                    <div>Newest: {new Date(stats.newestDebate).toLocaleDateString()}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Current Debates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Debates ({debates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading...
                </div>
              ) : debates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No debates found. Create some test data to get started.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {debates.map(debate => (
                    <div 
                      key={debate.id} 
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{debate.topic}</h4>
                          <div className="text-xs text-gray-600 mt-1">
                            {debate.participants.length} participants • {debate.messages.length} messages
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(debate.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge 
                          variant={debate.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {debate.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Results ({searchResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {searchResults.map(debate => (
                    <div 
                      key={debate.id} 
                      className="p-3 border border-blue-200 rounded-lg bg-blue-50"
                    >
                      <h4 className="font-medium text-sm">{debate.topic}</h4>
                      <div className="text-xs text-gray-600 mt-1">
                        {debate.hostName} • {new Date(debate.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemporaryDebateHistoryDemo;
