import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Info,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';
import { TemporaryDebateHistoryService } from '@/services/temporaryDebateHistoryService';
import { useToast } from '@/components/ui/use-toast';

interface DebateHistoryManagerProps {
  isVisible?: boolean;
  onClose?: () => void;
}

/**
 * Debate History Manager Component
 * Provides management interface for the temporary debate history system
 */
export const DebateHistoryManager: React.FC<DebateHistoryManagerProps> = ({
  isVisible = true,
  onClose
}) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      TemporaryDebateHistoryService.initialize();
      const storageStats = TemporaryDebateHistoryService.getStorageStats();
      setStats(storageStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load storage statistics',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJSON = () => {
    try {
      TemporaryDebateHistoryService.downloadJSON();
      toast({
        title: 'Export Complete',
        description: 'Debate history has been downloaded as JSON file'
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export debate history',
        variant: 'destructive'
      });
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const text = await file.text();
      const result = await TemporaryDebateHistoryService.importFromJSON(text);
      
      toast({
        title: 'Import Complete',
        description: `Imported ${result.success} debates successfully. ${result.failed} failed.`
      });
      
      loadStats();
    } catch (error) {
      console.error('Error importing:', error);
      toast({
        title: 'Import Failed',
        description: 'Failed to import debate history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSampleData = async () => {
    try {
      setIsLoading(true);
      await TemporaryDebateHistoryService.createSampleData();
      toast({
        title: 'Sample Data Created',
        description: 'Sample debate data has been added for testing'
      });
      loadStats();
    } catch (error) {
      console.error('Error creating sample data:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sample data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all debate history? This action cannot be undone. A backup will be created automatically.')) {
      return;
    }

    try {
      setIsLoading(true);
      const success = await TemporaryDebateHistoryService.clearAll();
      if (success) {
        toast({
          title: 'History Cleared',
          description: 'All debate history has been cleared. A backup was created.'
        });
        loadStats();
      } else {
        throw new Error('Clear operation failed');
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Clear Failed',
        description: 'Failed to clear debate history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (!stats) return <Badge variant="secondary">Loading...</Badge>;
    
    if (stats.totalDebates === 0) {
      return <Badge variant="outline">No Data</Badge>;
    } else if (stats.totalDebates < 10) {
      return <Badge variant="secondary">Light Usage</Badge>;
    } else if (stats.totalDebates < 50) {
      return <Badge variant="default">Normal Usage</Badge>;
    } else {
      return <Badge variant="destructive">Heavy Usage</Badge>;
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            <CardTitle>Temporary Debate History Manager</CardTitle>
            {getStatusBadge()}
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Manage your temporary debate history system until database connection is established
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* System Status */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This temporary system stores debate history in your browser's localStorage and provides JSON export/import capabilities. 
            All data will be easily migrated to the database when ready.
          </AlertDescription>
        </Alert>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="text-sm font-bold text-purple-600">{stats.version}</div>
                <div className="text-sm text-gray-600">System Version</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold text-orange-600">
                  {stats.lastBackup ? formatDate(stats.lastBackup) : 'None'}
                </div>
                <div className="text-sm text-gray-600">Last Backup</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Date Range */}
        {stats && stats.oldestDebate && stats.newestDebate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Oldest Debate:</span>
                  <span className="font-medium">{formatDate(stats.oldestDebate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Newest Debate:</span>
                  <span className="font-medium">{formatDate(stats.newestDebate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Management Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export/Import */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleExportJSON}
                  className="w-full"
                  variant="outline"
                  disabled={isLoading || !stats?.totalDebates}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                    id="import-file"
                    disabled={isLoading}
                  />
                  <label htmlFor="import-file">
                    <Button 
                      as="span"
                      variant="outline"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import from JSON
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* System Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  System Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={loadStats}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Stats
                </Button>
                
                <Button 
                  onClick={handleCreateSampleData}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Sample Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          {stats?.totalDebates > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleClearAll}
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All History
                </Button>
                <p className="text-xs text-gray-600 mt-2">
                  This will remove all stored debates. A backup will be created automatically.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Last Refresh */}
        <div className="text-xs text-gray-500 text-center">
          Last refreshed: {lastRefresh.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebateHistoryManager;
