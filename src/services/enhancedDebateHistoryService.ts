import type { HumanDebateRecord, Participant, ChatMessage } from '../types/debate';

/**
 * Enhanced Debug History Service with file-like storage system
 * Provides accurate debate history tracking with backup and recovery capabilities
 */
export class EnhancedDebateHistoryService {
  private static readonly STORAGE_VERSION = '2.0';
  private static readonly MAX_HISTORY_SIZE = 100; // Maximum number of debates to keep
  private static readonly BACKUP_KEY = 'debate_history_backup';
  
  /**
   * Initialize the enhanced storage system
   */
  static initializeStorage(): void {
    try {
      const metadata = this.getStorageMetadata();
      if (!metadata.version || metadata.version !== this.STORAGE_VERSION) {
        console.log('Initializing enhanced debate storage system...');
        this.migrateExistingData();
        this.setStorageMetadata({
          version: this.STORAGE_VERSION,
          initialized: new Date().toISOString(),
          totalDebates: 0,
          lastBackup: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  /**
   * Save a complete debate session with enhanced tracking
   */
  static async saveDebateSession(debate: HumanDebateRecord): Promise<string | null> {
    try {
      this.initializeStorage();
      
      // Generate a unique ID if not provided
      const debateId = debate.id || this.generateDebateId();
      const roomId = debate.roomId;
      
      // Prepare enhanced debate record
      const enhancedDebate: HumanDebateRecord = {
        ...debate,
        id: debateId,
        roomId: roomId,
        createdAt: debate.createdAt || new Date().toISOString(),
        endedAt: debate.endedAt || (debate.status === 'completed' ? new Date().toISOString() : undefined),
        status: debate.status || 'completed',
        tags: debate.tags || [],
        participants: debate.participants || [],
        messages: debate.messages || []
      };

      // Save to main storage
      const storageKey = `enhanced_debate_${debateId}`;
      localStorage.setItem(storageKey, JSON.stringify(enhancedDebate));
      
      // Update index
      this.updateDebateIndex(debateId, enhancedDebate);
      
      // Create backup
      this.createBackup();
      
      // Clean old data if needed
      this.cleanupOldData();
      
      console.log(`Enhanced debate saved: ${debateId} - ${debate.topic}`);
      return debateId;
    } catch (error) {
      console.error('Error saving enhanced debate session:', error);
      return null;
    }
  }

  /**
   * Get all debate history with enhanced metadata
   */
  static async getUserDebateHistory(userId?: string): Promise<HumanDebateRecord[]> {
    try {
      this.initializeStorage();
      
      const debates: HumanDebateRecord[] = [];
      const debateIndex = this.getDebateIndex();
      
      // Load debates from enhanced storage
      debateIndex.forEach(indexEntry => {
        try {
          const storageKey = `enhanced_debate_${indexEntry.id}`;
          const debateData = localStorage.getItem(storageKey);
          if (debateData) {
            const debate = JSON.parse(debateData) as HumanDebateRecord;
            debates.push(debate);
          }
        } catch (error) {
          console.warn(`Error loading debate ${indexEntry.id}:`, error);
        }
      });

      // Also migrate and include legacy data
      const legacyDebates = this.getLegacyDebates();
      debates.push(...legacyDebates);

      // Remove duplicates and sort by date
      const uniqueDebates = this.removeDuplicates(debates);
      return uniqueDebates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error getting debate history:', error);
      return [];
    }
  }

  /**
   * Get a specific debate by ID
   */
  static async getDebateById(id: string): Promise<HumanDebateRecord | null> {
    try {
      const storageKey = `enhanced_debate_${id}`;
      const debateData = localStorage.getItem(storageKey);
      if (debateData) {
        return JSON.parse(debateData) as HumanDebateRecord;
      }
      
      // Fallback to legacy storage
      const legacyDebate = await this.getLegacyDebateById(id);
      if (legacyDebate) {
        // Migrate to enhanced storage
        await this.saveDebateSession(legacyDebate);
        return legacyDebate;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting debate ${id}:`, error);
      return null;
    }
  }

  /**
   * Search debates by query
   */
  static async searchDebates(query: string): Promise<HumanDebateRecord[]> {
    try {
      const allDebates = await this.getUserDebateHistory();
      const searchTerm = query.toLowerCase();
      
      return allDebates.filter(debate => 
        debate.topic.toLowerCase().includes(searchTerm) ||
        debate.hostName.toLowerCase().includes(searchTerm) ||
        debate.participants.some(p => p.name.toLowerCase().includes(searchTerm)) ||
        debate.messages.some(m => m.text.toLowerCase().includes(searchTerm)) ||
        (debate.tags && debate.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    } catch (error) {
      console.error('Error searching debates:', error);
      return [];
    }
  }

  /**
   * Update debate status
   */
  static async updateDebateStatus(
    debateId: string, 
    status: 'waiting' | 'active' | 'completed', 
    winner?: 'FOR' | 'AGAINST' | 'DRAW'
  ): Promise<boolean> {
    try {
      const debate = await this.getDebateById(debateId);
      if (!debate) return false;
      
      debate.status = status;
      if (winner) debate.winner = winner;
      if (status === 'completed' && !debate.endedAt) {
        debate.endedAt = new Date().toISOString();
      }
      
      const result = await this.saveDebateSession(debate);
      return result !== null;
    } catch (error) {
      console.error('Error updating debate status:', error);
      return false;
    }
  }

  /**
   * Add tag to debate
   */
  static async addTagToDebate(debateId: string, tag: string): Promise<boolean> {
    try {
      const debate = await this.getDebateById(debateId);
      if (!debate) return false;
      
      if (!debate.tags) debate.tags = [];
      if (!debate.tags.includes(tag)) {
        debate.tags.push(tag);
        const result = await this.saveDebateSession(debate);
        return result !== null;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding tag to debate:', error);
      return false;
    }
  }

  /**
   * Remove tag from debate
   */
  static async removeTagFromDebate(debateId: string, tag: string): Promise<boolean> {
    try {
      const debate = await this.getDebateById(debateId);
      if (!debate) return false;
      
      if (debate.tags) {
        debate.tags = debate.tags.filter(t => t !== tag);
        const result = await this.saveDebateSession(debate);
        return result !== null;
      }
      
      return true;
    } catch (error) {
      console.error('Error removing tag from debate:', error);
      return false;
    }
  }

  /**
   * Export debate data as JSON
   */
  static exportDebateData(debates?: HumanDebateRecord[]): string {
    try {
      const dataToExport = debates || this.getUserDebateHistory();
      const exportData = {
        version: this.STORAGE_VERSION,
        exportedAt: new Date().toISOString(),
        totalDebates: Array.isArray(dataToExport) ? dataToExport.length : 0,
        debates: dataToExport
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting debate data:', error);
      return JSON.stringify({ error: 'Export failed' });
    }
  }

  /**
   * Import debate data from JSON
   */
  static async importDebateData(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.debates || !Array.isArray(importData.debates)) {
        throw new Error('Invalid import data format');
      }
      
      let successCount = 0;
      for (const debate of importData.debates) {
        const result = await this.saveDebateSession(debate);
        if (result) successCount++;
      }
      
      console.log(`Imported ${successCount} out of ${importData.debates.length} debates`);
      return successCount > 0;
    } catch (error) {
      console.error('Error importing debate data:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): {
    totalDebates: number;
    storageSize: string;
    oldestDebate?: string;
    newestDebate?: string;
    version: string;
  } {
    try {
      const debates = this.getUserDebateHistory();
      const storageSize = this.calculateStorageSize();
      
      let oldestDebate: string | undefined;
      let newestDebate: string | undefined;
      
      if (Array.isArray(debates) && debates.length > 0) {
        const sortedDebates = [...debates].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        oldestDebate = sortedDebates[0]?.createdAt;
        newestDebate = sortedDebates[sortedDebates.length - 1]?.createdAt;
      }
      
      return {
        totalDebates: Array.isArray(debates) ? debates.length : 0,
        storageSize,
        oldestDebate,
        newestDebate,
        version: this.STORAGE_VERSION
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalDebates: 0,
        storageSize: 'Unknown',
        version: this.STORAGE_VERSION
      };
    }
  }

  /**
   * Clear all debate history (with confirmation)
   */
  static async clearAllHistory(): Promise<boolean> {
    try {
      // Create final backup before clearing
      this.createBackup();
      
      // Clear enhanced storage
      const debateIndex = this.getDebateIndex();
      debateIndex.forEach(entry => {
        localStorage.removeItem(`enhanced_debate_${entry.id}`);
      });
      
      // Clear legacy storage
      this.clearLegacyStorage();
      
      // Clear metadata
      localStorage.removeItem('enhanced_debate_index');
      localStorage.removeItem('enhanced_debate_metadata');
      
      console.log('All debate history cleared');
      return true;
    } catch (error) {
      console.error('Error clearing debate history:', error);
      return false;
    }
  }

  // PRIVATE HELPER METHODS

  private static generateDebateId(): string {
    return `debate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getStorageMetadata(): any {
    try {
      const metadata = localStorage.getItem('enhanced_debate_metadata');
      return metadata ? JSON.parse(metadata) : {};
    } catch {
      return {};
    }
  }

  private static setStorageMetadata(metadata: any): void {
    localStorage.setItem('enhanced_debate_metadata', JSON.stringify(metadata));
  }

  private static getDebateIndex(): Array<{id: string, topic: string, createdAt: string}> {
    try {
      const index = localStorage.getItem('enhanced_debate_index');
      return index ? JSON.parse(index) : [];
    } catch {
      return [];
    }
  }

  private static updateDebateIndex(id: string, debate: HumanDebateRecord): void {
    try {
      const index = this.getDebateIndex();
      const existingIndex = index.findIndex(entry => entry.id === id);
      
      const indexEntry = {
        id,
        topic: debate.topic,
        createdAt: debate.createdAt
      };
      
      if (existingIndex >= 0) {
        index[existingIndex] = indexEntry;
      } else {
        index.push(indexEntry);
      }
      
      localStorage.setItem('enhanced_debate_index', JSON.stringify(index));
    } catch (error) {
      console.error('Error updating debate index:', error);
    }
  }

  private static migrateExistingData(): void {
    try {
      console.log('Migrating existing debate data...');
      const legacyDebates = this.getLegacyDebates();
      
      legacyDebates.forEach(async (debate) => {
        const debateId = this.generateDebateId();
        const enhancedDebate = { ...debate, id: debateId };
        const storageKey = `enhanced_debate_${debateId}`;
        localStorage.setItem(storageKey, JSON.stringify(enhancedDebate));
        this.updateDebateIndex(debateId, enhancedDebate);
      });
      
      console.log(`Migrated ${legacyDebates.length} legacy debates`);
    } catch (error) {
      console.error('Error migrating existing data:', error);
    }
  }

  private static getLegacyDebates(): HumanDebateRecord[] {
    try {
      const roomIds = Object.keys(localStorage).filter(key => 
        key.startsWith('debate_room_') && key.endsWith('_messages')
      );
      
      const debates: HumanDebateRecord[] = [];
      
      roomIds.forEach(messageKey => {
        try {
          const roomId = messageKey.replace('debate_room_', '').replace('_messages', '');
          const messagesKey = `debate_room_${roomId}_messages`;
          const participantsKey = `debate_room_${roomId}_participants`;
          const roomInfoKey = `debate_room_${roomId}_info`;
          
          const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
          const participants = JSON.parse(localStorage.getItem(participantsKey) || '[]');
          const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');
          
          if (roomInfo.topic) {
            const debate: HumanDebateRecord = {
              id: roomId,
              roomId: roomId,
              topic: roomInfo.topic || 'Unknown Topic',
              hostName: roomInfo.hostName || roomInfo.host || 'Unknown Host',
              participants: participants.map((p: any) => ({
                id: p.id || `participant_${Math.random().toString(36).substr(2, 9)}`,
                name: p.name || 'Unknown',
                side: p.side || 'OBSERVER',
                joinedAt: p.joinedAt || new Date().toISOString(),
                leftAt: p.leftAt,
                isActive: p.isActive !== undefined ? p.isActive : true,
                lastSeen: p.lastSeen || p.joinedAt || new Date().toISOString()
              })),
              messages: messages.map((m: any, index: number) => ({
                id: m.id || `msg_${index}`,
                senderId: m.sender || m.senderId || 'unknown',
                senderName: m.senderName || m.name || 'Unknown',
                text: m.message || m.text || '',
                side: m.side || 'OBSERVER',
                timestamp: m.timestamp || new Date().toISOString()
              })),
              createdAt: roomInfo.createdAt || new Date().toISOString(),
              endedAt: roomInfo.endedAt,
              status: roomInfo.status || 'completed',
              winner: roomInfo.winner,
              moderatorNotes: roomInfo.moderatorNotes,
              tags: roomInfo.tags || []
            };
            
            debates.push(debate);
          }
        } catch (parseError) {
          console.warn(`Error parsing legacy debate data for room:`, parseError);
        }
      });
      
      return debates;
    } catch (error) {
      console.error('Error getting legacy debates:', error);
      return [];
    }
  }

  private static async getLegacyDebateById(id: string): Promise<HumanDebateRecord | null> {
    try {
      const legacyDebates = this.getLegacyDebates();
      return legacyDebates.find(debate => debate.id === id || debate.roomId === id) || null;
    } catch {
      return null;
    }
  }

  private static removeDuplicates(debates: HumanDebateRecord[]): HumanDebateRecord[] {
    const seen = new Set<string>();
    return debates.filter(debate => {
      const key = `${debate.topic}_${debate.createdAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private static createBackup(): void {
    try {
      const debates = this.getUserDebateHistory();
      const backup = {
        version: this.STORAGE_VERSION,
        createdAt: new Date().toISOString(),
        totalDebates: Array.isArray(debates) ? debates.length : 0,
        debates: debates
      };
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  private static cleanupOldData(): void {
    try {
      const index = this.getDebateIndex();
      if (index.length > this.MAX_HISTORY_SIZE) {
        // Sort by creation date and remove oldest
        const sortedIndex = index.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        const toRemove = sortedIndex.slice(0, index.length - this.MAX_HISTORY_SIZE);
        toRemove.forEach(entry => {
          localStorage.removeItem(`enhanced_debate_${entry.id}`);
        });
        
        const newIndex = sortedIndex.slice(index.length - this.MAX_HISTORY_SIZE);
        localStorage.setItem('enhanced_debate_index', JSON.stringify(newIndex));
      }
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  private static clearLegacyStorage(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('debate_room_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing legacy storage:', error);
    }
  }

  private static calculateStorageSize(): string {
    try {
      let totalSize = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('enhanced_debate_') || key.startsWith('debate_room_')) {
          totalSize += (localStorage.getItem(key) || '').length;
        }
      });
      
      if (totalSize < 1024) return `${totalSize} bytes`;
      if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(2)} KB`;
      return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return 'Unknown';
    }
  }
}

export default EnhancedDebateHistoryService;
