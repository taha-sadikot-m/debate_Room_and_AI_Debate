import type { HumanDebateRecord, Participant, ChatMessage } from '../types/debate';

/**
 * Temporary Debate History Service
 * A robust temporary solution for accurate debate history tracking
 * Uses localStorage + JSON export/import + backup systems
 * Designed to be easily migrated to database later
 */
export class TemporaryDebateHistoryService {
  private static readonly STORAGE_PREFIX = 'temp_debate_';
  private static readonly INDEX_KEY = 'temp_debate_index';
  private static readonly METADATA_KEY = 'temp_debate_metadata';
  private static readonly BACKUP_KEY = 'temp_debate_backup';
  private static readonly VERSION = '1.0';
  private static readonly MAX_DEBATES = 200;
  private static readonly AUTO_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Initialize the temporary storage system
   */
  static initialize(): void {
    try {
      const metadata = this.getMetadata();
      if (!metadata.version || metadata.version !== this.VERSION) {
        console.log('Initializing temporary debate history system...');
        this.setMetadata({
          version: this.VERSION,
          initialized: new Date().toISOString(),
          totalDebates: 0,
          lastBackup: new Date().toISOString(),
          lastCleanup: new Date().toISOString()
        });
        this.migrateExistingData();
      }
      
      // Auto-backup if needed
      this.performAutoBackup();
      
      console.log('✅ Temporary debate history system ready');
    } catch (error) {
      console.error('Error initializing temporary storage:', error);
    }
  }

  /**
   * Save a debate session
   */
  static async saveDebate(debate: HumanDebateRecord): Promise<string | null> {
    try {
      this.initialize();
      
      const debateId = debate.id || this.generateId();
      const enhancedDebate: HumanDebateRecord = {
        ...debate,
        id: debateId,
        createdAt: debate.createdAt || new Date().toISOString(),
        status: debate.status || 'completed',
        participants: debate.participants || [],
        messages: debate.messages || [],
        tags: debate.tags || []
      };

      // Save to localStorage
      const storageKey = `${this.STORAGE_PREFIX}${debateId}`;
      localStorage.setItem(storageKey, JSON.stringify(enhancedDebate));
      
      // Update index
      this.updateIndex(debateId, enhancedDebate);
      
      // Update metadata
      const metadata = this.getMetadata();
      metadata.totalDebates = this.getIndex().length;
      metadata.lastSaved = new Date().toISOString();
      this.setMetadata(metadata);
      
      // Cleanup if needed
      this.cleanup();
      
      console.log(`💾 Debate saved: ${debateId} - ${debate.topic}`);
      return debateId;
    } catch (error) {
      console.error('Error saving debate:', error);
      return null;
    }
  }

  /**
   * Get all debates
   */
  static async getAllDebates(userId?: string): Promise<HumanDebateRecord[]> {
    try {
      this.initialize();
      
      const debates: HumanDebateRecord[] = [];
      const index = this.getIndex();
      
      index.forEach(indexEntry => {
        try {
          const storageKey = `${this.STORAGE_PREFIX}${indexEntry.id}`;
          const debateData = localStorage.getItem(storageKey);
          if (debateData) {
            const debate = JSON.parse(debateData) as HumanDebateRecord;
            debates.push(debate);
          }
        } catch (error) {
          console.warn(`Error loading debate ${indexEntry.id}:`, error);
        }
      });

      // Sort by creation date (newest first)
      return debates.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting debates:', error);
      return [];
    }
  }

  /**
   * Get a specific debate by ID
   */
  static async getDebateById(id: string): Promise<HumanDebateRecord | null> {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${id}`;
      const debateData = localStorage.getItem(storageKey);
      if (debateData) {
        return JSON.parse(debateData) as HumanDebateRecord;
      }
      return null;
    } catch (error) {
      console.error(`Error getting debate ${id}:`, error);
      return null;
    }
  }

  /**
   * Search debates
   */
  static async searchDebates(query: string): Promise<HumanDebateRecord[]> {
    try {
      const allDebates = await this.getAllDebates();
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
      
      const result = await this.saveDebate(debate);
      return result !== null;
    } catch (error) {
      console.error('Error updating debate status:', error);
      return false;
    }
  }

  /**
   * Add message to debate
   */
  static async addMessage(debateId: string, message: ChatMessage): Promise<boolean> {
    try {
      const debate = await this.getDebateById(debateId);
      if (!debate) return false;
      
      debate.messages.push(message);
      const result = await this.saveDebate(debate);
      return result !== null;
    } catch (error) {
      console.error('Error adding message:', error);
      return false;
    }
  }

  /**
   * Add participant to debate
   */
  static async addParticipant(debateId: string, participant: Participant): Promise<boolean> {
    try {
      const debate = await this.getDebateById(debateId);
      if (!debate) return false;
      
      // Check if participant already exists
      const existingIndex = debate.participants.findIndex(p => p.id === participant.id);
      if (existingIndex >= 0) {
        debate.participants[existingIndex] = participant;
      } else {
        debate.participants.push(participant);
      }
      
      const result = await this.saveDebate(debate);
      return result !== null;
    } catch (error) {
      console.error('Error adding participant:', error);
      return false;
    }
  }

  /**
   * Export all debates as JSON
   */
  static exportToJSON(): string {
    try {
      const allDebates = this.getAllDebates();
      const metadata = this.getMetadata();
      
      const exportData = {
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        metadata,
        totalDebates: Array.isArray(allDebates) ? allDebates.length : 0,
        debates: allDebates
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      return JSON.stringify({ error: 'Export failed' });
    }
  }

  /**
   * Import debates from JSON
   */
  static async importFromJSON(jsonData: string): Promise<{ success: number; failed: number }> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.debates || !Array.isArray(importData.debates)) {
        throw new Error('Invalid import data format');
      }
      
      let successCount = 0;
      let failedCount = 0;
      
      for (const debate of importData.debates) {
        const result = await this.saveDebate(debate);
        if (result) {
          successCount++;
        } else {
          failedCount++;
        }
      }
      
      console.log(`📥 Import complete: ${successCount} success, ${failedCount} failed`);
      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error('Error importing from JSON:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Download debates as JSON file
   */
  static downloadJSON(filename?: string): void {
    try {
      const jsonData = this.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `debate-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('📁 Debate history downloaded');
    } catch (error) {
      console.error('Error downloading JSON:', error);
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
    lastBackup?: string;
  } {
    try {
      const debates = this.getAllDebates();
      const metadata = this.getMetadata();
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
        version: this.VERSION,
        lastBackup: metadata.lastBackup
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalDebates: 0,
        storageSize: 'Unknown',
        version: this.VERSION
      };
    }
  }

  /**
   * Clear all debate history
   */
  static async clearAll(): Promise<boolean> {
    try {
      // Create final backup
      this.createBackup();
      
      // Clear all debate data
      const index = this.getIndex();
      index.forEach(entry => {
        const storageKey = `${this.STORAGE_PREFIX}${entry.id}`;
        localStorage.removeItem(storageKey);
      });
      
      // Clear metadata
      localStorage.removeItem(this.INDEX_KEY);
      localStorage.removeItem(this.METADATA_KEY);
      
      console.log('🗑️ All debate history cleared');
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }

  /**
   * Create sample debate data for testing
   */
  static async createSampleData(): Promise<void> {
    try {
      const sampleDebates: HumanDebateRecord[] = [
        {
          id: this.generateId(),
          roomId: 'sample-1',
          topic: 'Should artificial intelligence be regulated by government?',
          hostName: 'Alice Johnson',
          participants: [
            {
              id: 'alice-1',
              name: 'Alice Johnson',
              side: 'FOR',
              joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            },
            {
              id: 'bob-1',
              name: 'Bob Smith',
              side: 'AGAINST',
              joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            }
          ],
          messages: [
            {
              id: 'msg-1',
              senderId: 'alice-1',
              senderName: 'Alice Johnson',
              text: 'I believe AI regulation is necessary to prevent misuse and ensure ethical development.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-2',
              senderId: 'bob-1',
              senderName: 'Bob Smith',
              text: 'Over-regulation could stifle innovation and technological progress.',
              side: 'AGAINST',
              timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-3',
              senderId: 'alice-1',
              senderName: 'Alice Johnson',
              text: 'But without proper guidelines, AI could pose significant risks to privacy and security.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          endedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'completed',
          winner: 'FOR',
          tags: ['technology', 'policy', 'sample']
        },
        {
          id: this.generateId(),
          roomId: 'sample-2',
          topic: 'Is remote work better than office work?',
          hostName: 'Carol Williams',
          participants: [
            {
              id: 'carol-1',
              name: 'Carol Williams',
              side: 'FOR',
              joinedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            },
            {
              id: 'david-1',
              name: 'David Brown',
              side: 'AGAINST',
              joinedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            }
          ],
          messages: [
            {
              id: 'msg-4',
              senderId: 'carol-1',
              senderName: 'Carol Williams',
              text: 'Remote work offers better work-life balance and eliminates commuting stress.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-5',
              senderId: 'david-1',
              senderName: 'David Brown',
              text: 'Office work provides better collaboration and team building opportunities.',
              side: 'AGAINST',
              timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          endedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'completed',
          winner: 'DRAW',
          tags: ['workplace', 'lifestyle', 'sample']
        }
      ];

      for (const debate of sampleDebates) {
        await this.saveDebate(debate);
      }

      console.log(`✅ Created ${sampleDebates.length} sample debates`);
    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  }

  // PRIVATE HELPER METHODS

  private static generateId(): string {
    return `debate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getMetadata(): any {
    try {
      const metadata = localStorage.getItem(this.METADATA_KEY);
      return metadata ? JSON.parse(metadata) : {};
    } catch {
      return {};
    }
  }

  private static setMetadata(metadata: any): void {
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }

  private static getIndex(): Array<{ id: string; topic: string; createdAt: string }> {
    try {
      const index = localStorage.getItem(this.INDEX_KEY);
      return index ? JSON.parse(index) : [];
    } catch {
      return [];
    }
  }

  private static updateIndex(id: string, debate: HumanDebateRecord): void {
    try {
      const index = this.getIndex();
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
      
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(index));
    } catch (error) {
      console.error('Error updating index:', error);
    }
  }

  private static cleanup(): void {
    try {
      const index = this.getIndex();
      if (index.length > this.MAX_DEBATES) {
        // Sort by creation date and remove oldest
        const sortedIndex = index.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        const toRemove = sortedIndex.slice(0, index.length - this.MAX_DEBATES);
        toRemove.forEach(entry => {
          const storageKey = `${this.STORAGE_PREFIX}${entry.id}`;
          localStorage.removeItem(storageKey);
        });
        
        const newIndex = sortedIndex.slice(index.length - this.MAX_DEBATES);
        localStorage.setItem(this.INDEX_KEY, JSON.stringify(newIndex));
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  private static calculateStorageSize(): string {
    try {
      let totalSize = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX) || 
            key === this.INDEX_KEY || 
            key === this.METADATA_KEY) {
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

  private static migrateExistingData(): void {
    try {
      console.log('Migrating existing debate data...');
      let migratedCount = 0;
      
      // Migrate from enhanced service
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('enhanced_debate_') || key.startsWith('debate_room_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const debate = JSON.parse(data);
              if (debate.topic) {
                this.saveDebate(debate);
                migratedCount++;
              }
            }
          } catch (error) {
            console.warn(`Error migrating ${key}:`, error);
          }
        }
      });
      
      if (migratedCount > 0) {
        console.log(`Migrated ${migratedCount} existing debates`);
      }
    } catch (error) {
      console.error('Error migrating existing data:', error);
    }
  }

  private static createBackup(): void {
    try {
      const debates = this.getAllDebates();
      const backup = {
        version: this.VERSION,
        createdAt: new Date().toISOString(),
        totalDebates: Array.isArray(debates) ? debates.length : 0,
        debates
      };
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      console.log('📦 Backup created');
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  private static performAutoBackup(): void {
    try {
      const metadata = this.getMetadata();
      const lastBackup = metadata.lastBackup ? new Date(metadata.lastBackup) : new Date(0);
      const now = new Date();
      
      if (now.getTime() - lastBackup.getTime() > this.AUTO_BACKUP_INTERVAL) {
        this.createBackup();
        metadata.lastBackup = now.toISOString();
        this.setMetadata(metadata);
      }
    } catch (error) {
      console.error('Error performing auto-backup:', error);
    }
  }
}

export default TemporaryDebateHistoryService;
