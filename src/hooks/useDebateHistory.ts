import { useEffect, useRef, useCallback } from 'react';
import { debateAutoSaver } from '../services/debateAutoSaver';
import { EnhancedDebateHistoryService } from '../services/enhancedDebateHistoryService';
import type { HumanDebateRecord, Participant, ChatMessage } from '../types/debate';

interface UseDebateHistoryOptions {
  roomId: string;
  topic: string;
  hostName: string;
  autoSave?: boolean;
  saveInterval?: number; // milliseconds
}

interface UseDebateHistoryReturn {
  registerDebate: () => void;
  addParticipant: (participant: { id: string; name: string; side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' }) => void;
  updateParticipant: (participantId: string, updates: { isActive?: boolean; leftAt?: string; side?: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' }) => void;
  addMessage: (message: { senderId: string; senderName: string; text: string; side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' }) => void;
  updateStatus: (status: 'waiting' | 'active' | 'completed', winner?: 'FOR' | 'AGAINST' | 'DRAW') => void;
  addModeratorNotes: (notes: string) => void;
  addTags: (tags: string[]) => void;
  saveDebate: () => Promise<boolean>;
  getDebateData: () => Partial<HumanDebateRecord> | null;
  exportDebate: () => string;
}

/**
 * Custom hook for managing debate history with enhanced storage
 * Automatically tracks debate progress and saves to enhanced storage
 */
export const useDebateHistory = ({
  roomId,
  topic,
  hostName,
  autoSave = true,
  saveInterval = 30000 // 30 seconds
}: UseDebateHistoryOptions): UseDebateHistoryReturn => {
  const isRegistered = useRef(false);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize debate tracking
  const registerDebate = useCallback(() => {
    if (!isRegistered.current) {
      console.log(`[DebateHistory] Registering debate: ${roomId} - ${topic}`);
      debateAutoSaver.registerDebate(roomId, {
        topic,
        hostName,
        status: 'waiting'
      });
      isRegistered.current = true;

      // Start auto-save if enabled
      if (autoSave) {
        autoSaveInterval.current = setInterval(() => {
          debateAutoSaver.saveDebate(roomId);
        }, saveInterval);
      }
    }
  }, [roomId, topic, hostName, autoSave, saveInterval]);

  // Add participant to debate
  const addParticipant = useCallback((participant: { 
    id: string; 
    name: string; 
    side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' 
  }) => {
    if (isRegistered.current) {
      debateAutoSaver.addParticipant(roomId, participant);
      console.log(`[DebateHistory] Added participant: ${participant.name} (${participant.side})`);
    }
  }, [roomId]);

  // Update participant information
  const updateParticipant = useCallback((participantId: string, updates: { 
    isActive?: boolean; 
    leftAt?: string; 
    side?: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' 
  }) => {
    if (isRegistered.current) {
      debateAutoSaver.updateParticipant(roomId, participantId, updates);
    }
  }, [roomId]);

  // Add message to debate
  const addMessage = useCallback((message: { 
    senderId: string; 
    senderName: string; 
    text: string; 
    side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' 
  }) => {
    if (isRegistered.current) {
      debateAutoSaver.addMessage(roomId, message);
    }
  }, [roomId]);

  // Update debate status
  const updateStatus = useCallback((
    status: 'waiting' | 'active' | 'completed', 
    winner?: 'FOR' | 'AGAINST' | 'DRAW'
  ) => {
    if (isRegistered.current) {
      debateAutoSaver.updateDebateStatus(roomId, status, winner);
      console.log(`[DebateHistory] Updated status: ${status}${winner ? ` - Winner: ${winner}` : ''}`);
    }
  }, [roomId]);

  // Add moderator notes
  const addModeratorNotes = useCallback((notes: string) => {
    if (isRegistered.current) {
      debateAutoSaver.addModeratorNotes(roomId, notes);
    }
  }, [roomId]);

  // Add tags to debate
  const addTags = useCallback((tags: string[]) => {
    if (isRegistered.current) {
      debateAutoSaver.addTags(roomId, tags);
    }
  }, [roomId]);

  // Manually save debate
  const saveDebate = useCallback(async (): Promise<boolean> => {
    if (isRegistered.current) {
      const result = await debateAutoSaver.saveDebate(roomId);
      console.log(`[DebateHistory] Manual save result: ${result}`);
      return result;
    }
    return false;
  }, [roomId]);

  // Get current debate data
  const getDebateData = useCallback((): Partial<HumanDebateRecord> | null => {
    if (isRegistered.current) {
      return debateAutoSaver.getDebateData(roomId);
    }
    return null;
  }, [roomId]);

  // Export debate as JSON
  const exportDebate = useCallback((): string => {
    const debateData = getDebateData();
    if (debateData) {
      return EnhancedDebateHistoryService.exportDebateData([debateData as HumanDebateRecord]);
    }
    return JSON.stringify({ error: 'No debate data available' });
  }, [getDebateData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
      
      // Final save on unmount
      if (isRegistered.current) {
        console.log(`[DebateHistory] Final save on unmount: ${roomId}`);
        debateAutoSaver.saveDebate(roomId);
      }
    };
  }, [roomId]);

  return {
    registerDebate,
    addParticipant,
    updateParticipant,
    addMessage,
    updateStatus,
    addModeratorNotes,
    addTags,
    saveDebate,
    getDebateData,
    exportDebate
  };
};

export default useDebateHistory;
