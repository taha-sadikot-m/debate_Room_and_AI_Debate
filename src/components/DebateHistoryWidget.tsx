import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Database, 
  Clock, 
  Users, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useDebateHistory } from '@/hooks/useDebateHistory';
import type { HumanDebateRecord } from '@/types/debate';

interface DebateHistoryWidgetProps {
  roomId: string;
  topic: string;
  hostName: string;
  isVisible?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  compact?: boolean;
}

/**
 * Debate History Widget
 * A small, unobtrusive widget that can be added to any debate component
 * to provide enhanced history tracking and saving capabilities
 */
export const DebateHistoryWidget: React.FC<DebateHistoryWidgetProps> = ({
  roomId,
  topic,
  hostName,
  isVisible = true,
  position = 'bottom-right',
  compact = true
}) => {
  const {
    registerDebate,
    saveDebate,
    getDebateData,
    exportDebate
  } = useDebateHistory({
    roomId,
    topic,
    hostName,
    autoSave: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [debateStats, setDebateStats] = useState<{
    participants: number;
    messages: number;
    duration: string;
  }>({ participants: 0, messages: 0, duration: '0m' });

  // Register debate on mount
  useEffect(() => {
    registerDebate();
  }, [registerDebate]);

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      const data = getDebateData();
      if (data) {
        const startTime = data.createdAt ? new Date(data.createdAt) : new Date();
        const duration = Math.floor((Date.now() - startTime.getTime()) / 60000); // minutes
        
        setDebateStats({
          participants: data.participants?.length || 0,
          messages: data.messages?.length || 0,
          duration: `${duration}m`
        });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [getDebateData]);

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveDebate();
      if (success) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Manual save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    try {
      const exportData = exportDebate();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `debate_${roomId}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm`}>
      <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
        <CardContent className={`${compact ? 'p-3' : 'p-4'}`}>
          {!compact && (
            <div className="flex items-center gap-2 mb-3">
              <Database size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Debate History</span>
              <Badge variant="secondary" className="text-xs">Enhanced</Badge>
            </div>
          )}
          
          {/* Stats */}
          <div className={`grid grid-cols-3 gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Users size={12} className="text-gray-500" />
                <span className="text-xs font-medium">{debateStats.participants}</span>
              </div>
              {!compact && <span className="text-xs text-gray-500">People</span>}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageSquare size={12} className="text-gray-500" />
                <span className="text-xs font-medium">{debateStats.messages}</span>
              </div>
              {!compact && <span className="text-xs text-gray-500">Messages</span>}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock size={12} className="text-gray-500" />
                <span className="text-xs font-medium">{debateStats.duration}</span>
              </div>
              {!compact && <span className="text-xs text-gray-500">Duration</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex-1 h-7 text-xs"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600" />
              ) : (
                <Save size={12} />
              )}
              {!compact && (isSaving ? 'Saving...' : 'Save')}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="h-7"
            >
              <Download size={12} />
            </Button>
          </div>

          {/* Status */}
          {lastSaved && (
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle size={10} className="text-green-500" />
              <span className="text-xs text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}
          
          {compact && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Auto-saving every 30s
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebateHistoryWidget;
