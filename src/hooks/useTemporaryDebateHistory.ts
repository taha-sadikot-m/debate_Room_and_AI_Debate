import { useState, useEffect, useCallback } from 'react';
import { TemporaryDebateHistoryService } from '@/services/temporaryDebateHistoryService';
import type { HumanDebateRecord, Participant, ChatMessage } from '@/types/debate';

interface UseTemporaryDebateHistoryOptions {
  autoLoad?: boolean;
  autoSave?: boolean;
  debateId?: string;
}

interface UseTemporaryDebateHistoryReturn {
  // Data
  debates: HumanDebateRecord[];
  currentDebate: HumanDebateRecord | null;
  isLoading: boolean;
  stats: any;
  
  // Actions
  loadDebates: () => Promise<void>;
  saveDebate: (debate: HumanDebateRecord) => Promise<string | null>;
  getDebateById: (id: string) => Promise<HumanDebateRecord | null>;
  searchDebates: (query: string) => Promise<HumanDebateRecord[]>;
  updateDebateStatus: (id: string, status: 'waiting' | 'active' | 'completed', winner?: 'FOR' | 'AGAINST' | 'DRAW') => Promise<boolean>;
  addMessage: (debateId: string, message: ChatMessage) => Promise<boolean>;
  addParticipant: (debateId: string, participant: Participant) => Promise<boolean>;
  
  // Utilities
  exportToJSON: () => string;
  downloadJSON: () => void;
  importFromJSON: (jsonData: string) => Promise<{ success: number; failed: number }>;
  createSampleData: () => Promise<void>;
  clearAll: () => Promise<boolean>;
  refreshStats: () => void;
}

/**
 * Custom hook for managing temporary debate history
 * Provides easy access to all temporary storage functionality
 */
export const useTemporaryDebateHistory = (
  options: UseTemporaryDebateHistoryOptions = {}
): UseTemporaryDebateHistoryReturn => {
  const { autoLoad = true, autoSave = false, debateId } = options;
  
  const [debates, setDebates] = useState<HumanDebateRecord[]>([]);
  const [currentDebate, setCurrentDebate] = useState<HumanDebateRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Initialize service and load data
  useEffect(() => {
    TemporaryDebateHistoryService.initialize();
    refreshStats();
    
    if (autoLoad) {
      loadDebates();
    }
  }, [autoLoad]);

  // Load specific debate if debateId is provided
  useEffect(() => {
    if (debateId) {
      loadCurrentDebate(debateId);
    }
  }, [debateId]);

  const loadDebates = useCallback(async () => {
    setIsLoading(true);
    try {
      const allDebates = await TemporaryDebateHistoryService.getAllDebates();
      setDebates(allDebates);
    } catch (error) {
      console.error('Error loading debates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCurrentDebate = useCallback(async (id: string) => {
    try {
      const debate = await TemporaryDebateHistoryService.getDebateById(id);
      setCurrentDebate(debate);
    } catch (error) {
      console.error('Error loading current debate:', error);
    }
  }, []);

  const saveDebate = useCallback(async (debate: HumanDebateRecord): Promise<string | null> => {
    try {
      const result = await TemporaryDebateHistoryService.saveDebate(debate);
      
      if (result) {
        // Update local state
        setDebates(prev => {
          const existingIndex = prev.findIndex(d => d.id === debate.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = debate;
            return updated;
          } else {
            return [debate, ...prev];
          }
        });
        
        // Update current debate if it's the same one
        if (currentDebate?.id === debate.id) {
          setCurrentDebate(debate);
        }
        
        refreshStats();
      }
      
      return result;
    } catch (error) {
      console.error('Error saving debate:', error);
      return null;
    }
  }, [currentDebate]);

  const getDebateById = useCallback(async (id: string): Promise<HumanDebateRecord | null> => {
    try {
      return await TemporaryDebateHistoryService.getDebateById(id);
    } catch (error) {
      console.error('Error getting debate by ID:', error);
      return null;
    }
  }, []);

  const searchDebates = useCallback(async (query: string): Promise<HumanDebateRecord[]> => {
    try {
      return await TemporaryDebateHistoryService.searchDebates(query);
    } catch (error) {
      console.error('Error searching debates:', error);
      return [];
    }
  }, []);

  const updateDebateStatus = useCallback(async (
    id: string, 
    status: 'waiting' | 'active' | 'completed', 
    winner?: 'FOR' | 'AGAINST' | 'DRAW'
  ): Promise<boolean> => {
    try {
      const result = await TemporaryDebateHistoryService.updateDebateStatus(id, status, winner);
      
      if (result) {
        // Refresh data
        await loadDebates();
        if (currentDebate?.id === id) {
          await loadCurrentDebate(id);
        }
        refreshStats();
      }
      
      return result;
    } catch (error) {
      console.error('Error updating debate status:', error);
      return false;
    }
  }, [currentDebate, loadDebates]);

  const addMessage = useCallback(async (debateId: string, message: ChatMessage): Promise<boolean> => {
    try {
      const result = await TemporaryDebateHistoryService.addMessage(debateId, message);
      
      if (result) {
        // Update local state if this is the current debate
        if (currentDebate?.id === debateId) {
          setCurrentDebate(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, message]
            };
          });
        }
        
        // Auto-save if enabled
        if (autoSave && currentDebate?.id === debateId) {
          const updatedDebate = await getDebateById(debateId);
          if (updatedDebate) {
            await saveDebate(updatedDebate);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error adding message:', error);
      return false;
    }
  }, [currentDebate, autoSave, getDebateById, saveDebate]);

  const addParticipant = useCallback(async (debateId: string, participant: Participant): Promise<boolean> => {
    try {
      const result = await TemporaryDebateHistoryService.addParticipant(debateId, participant);
      
      if (result) {
        // Update local state if this is the current debate
        if (currentDebate?.id === debateId) {
          setCurrentDebate(prev => {
            if (!prev) return prev;
            const existingIndex = prev.participants.findIndex(p => p.id === participant.id);
            const updatedParticipants = [...prev.participants];
            
            if (existingIndex >= 0) {
              updatedParticipants[existingIndex] = participant;
            } else {
              updatedParticipants.push(participant);
            }
            
            return {
              ...prev,
              participants: updatedParticipants
            };
          });
        }
        
        // Auto-save if enabled
        if (autoSave && currentDebate?.id === debateId) {
          const updatedDebate = await getDebateById(debateId);
          if (updatedDebate) {
            await saveDebate(updatedDebate);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error adding participant:', error);
      return false;
    }
  }, [currentDebate, autoSave, getDebateById, saveDebate]);

  const exportToJSON = useCallback((): string => {
    try {
      return TemporaryDebateHistoryService.exportToJSON();
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      return JSON.stringify({ error: 'Export failed' });
    }
  }, []);

  const downloadJSON = useCallback((): void => {
    try {
      TemporaryDebateHistoryService.downloadJSON();
    } catch (error) {
      console.error('Error downloading JSON:', error);
    }
  }, []);

  const importFromJSON = useCallback(async (jsonData: string): Promise<{ success: number; failed: number }> => {
    try {
      const result = await TemporaryDebateHistoryService.importFromJSON(jsonData);
      
      if (result.success > 0) {
        await loadDebates();
        refreshStats();
      }
      
      return result;
    } catch (error) {
      console.error('Error importing from JSON:', error);
      return { success: 0, failed: 0 };
    }
  }, [loadDebates]);

  const createSampleData = useCallback(async (): Promise<void> => {
    try {
      await TemporaryDebateHistoryService.createSampleData();
      await loadDebates();
      refreshStats();
    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  }, [loadDebates]);

  const clearAll = useCallback(async (): Promise<boolean> => {
    try {
      const result = await TemporaryDebateHistoryService.clearAll();
      
      if (result) {
        setDebates([]);
        setCurrentDebate(null);
        refreshStats();
      }
      
      return result;
    } catch (error) {
      console.error('Error clearing all:', error);
      return false;
    }
  }, []);

  const refreshStats = useCallback(() => {
    try {
      const storageStats = TemporaryDebateHistoryService.getStorageStats();
      setStats(storageStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, []);

  return {
    // Data
    debates,
    currentDebate,
    isLoading,
    stats,
    
    // Actions
    loadDebates,
    saveDebate,
    getDebateById,
    searchDebates,
    updateDebateStatus,
    addMessage,
    addParticipant,
    
    // Utilities
    exportToJSON,
    downloadJSON,
    importFromJSON,
    createSampleData,
    clearAll,
    refreshStats
  };
};

export default useTemporaryDebateHistory;
