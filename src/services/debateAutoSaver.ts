import { EnhancedDebateHistoryService } from './enhancedDebateHistoryService';
import type { HumanDebateRecord, Participant, ChatMessage } from '../types/debate';

/**
 * Debate Auto-Save Utility
 * Automatically captures and saves debate data with proper formatting
 */
export class DebateAutoSaver {
  private static instance: DebateAutoSaver | null = null;
  private activeDebates: Map<string, Partial<HumanDebateRecord>> = new Map();
  private autoSaveInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize the enhanced storage system
    EnhancedDebateHistoryService.initializeStorage();
    
    // Start auto-save interval (every 30 seconds)
    this.startAutoSave();
  }

  static getInstance(): DebateAutoSaver {
    if (!DebateAutoSaver.instance) {
      DebateAutoSaver.instance = new DebateAutoSaver();
    }
    return DebateAutoSaver.instance;
  }

  /**
   * Register a new debate session
   */
  registerDebate(roomId: string, initialData: {
    topic: string;
    hostName: string;
    status?: 'waiting' | 'active' | 'completed';
  }): void {
    console.log(`Registering debate: ${roomId} - ${initialData.topic}`);
    
    const debateRecord: Partial<HumanDebateRecord> = {
      id: this.generateDebateId(),
      roomId,
      topic: initialData.topic,
      hostName: initialData.hostName,
      status: initialData.status || 'waiting',
      createdAt: new Date().toISOString(),
      participants: [],
      messages: [],
      tags: []
    };

    this.activeDebates.set(roomId, debateRecord);
  }

  /**
   * Add a participant to a debate
   */
  addParticipant(roomId: string, participant: {
    id: string;
    name: string;
    side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  }): void {
    const debate = this.activeDebates.get(roomId);
    if (!debate) {
      console.warn(`Debate ${roomId} not found when adding participant`);
      return;
    }

    if (!debate.participants) debate.participants = [];

    const existingParticipant = debate.participants.find(p => p.id === participant.id);
    if (!existingParticipant) {
      const newParticipant: Participant = {
        id: participant.id,
        name: participant.name,
        side: participant.side,
        joinedAt: new Date().toISOString(),
        isActive: true,
        lastSeen: new Date().toISOString()
      };
      
      debate.participants.push(newParticipant);
      console.log(`Added participant ${participant.name} to debate ${roomId}`);
    }
  }

  /**
   * Update participant status
   */
  updateParticipant(roomId: string, participantId: string, updates: {
    isActive?: boolean;
    leftAt?: string;
    side?: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  }): void {
    const debate = this.activeDebates.get(roomId);
    if (!debate || !debate.participants) return;

    const participant = debate.participants.find(p => p.id === participantId);
    if (participant) {
      if (updates.isActive !== undefined) participant.isActive = updates.isActive;
      if (updates.leftAt) participant.leftAt = updates.leftAt;
      if (updates.side) participant.side = updates.side;
      participant.lastSeen = new Date().toISOString();
    }
  }

  /**
   * Add a message to a debate
   */
  addMessage(roomId: string, message: {
    senderId: string;
    senderName: string;
    text: string;
    side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  }): void {
    const debate = this.activeDebates.get(roomId);
    if (!debate) {
      console.warn(`Debate ${roomId} not found when adding message`);
      return;
    }

    if (!debate.messages) debate.messages = [];

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: message.senderId,
      senderName: message.senderName,
      text: message.text,
      side: message.side,
      timestamp: new Date().toISOString()
    };

    debate.messages.push(newMessage);
    
    // Update participant's last seen
    this.updateParticipant(roomId, message.senderId, { isActive: true });
  }

  /**
   * Update debate status
   */
  updateDebateStatus(roomId: string, status: 'waiting' | 'active' | 'completed', winner?: 'FOR' | 'AGAINST' | 'DRAW'): void {
    const debate = this.activeDebates.get(roomId);
    if (!debate) return;

    debate.status = status;
    if (winner) debate.winner = winner;
    
    if (status === 'completed') {
      debate.endedAt = new Date().toISOString();
      // Save immediately when completed
      this.saveDebate(roomId);
    }
  }

  /**
   * Add moderator notes
   */
  addModeratorNotes(roomId: string, notes: string): void {
    const debate = this.activeDebates.get(roomId);
    if (!debate) return;

    debate.moderatorNotes = notes;
  }

  /**
   * Add tags to a debate
   */
  addTags(roomId: string, tags: string[]): void {
    const debate = this.activeDebates.get(roomId);
    if (!debate) return;

    if (!debate.tags) debate.tags = [];
    tags.forEach(tag => {
      if (!debate.tags!.includes(tag)) {
        debate.tags!.push(tag);
      }
    });
  }

  /**
   * Manually save a debate
   */
  async saveDebate(roomId: string): Promise<boolean> {
    const debate = this.activeDebates.get(roomId);
    if (!debate) {
      console.warn(`Debate ${roomId} not found for saving`);
      return false;
    }

    // Ensure all required fields are present
    const completeDebate: HumanDebateRecord = {
      id: debate.id || this.generateDebateId(),
      roomId: debate.roomId || roomId,
      topic: debate.topic || 'Unknown Topic',
      hostName: debate.hostName || 'Unknown Host',
      participants: debate.participants || [],
      messages: debate.messages || [],
      createdAt: debate.createdAt || new Date().toISOString(),
      endedAt: debate.endedAt,
      status: debate.status || 'completed',
      winner: debate.winner,
      moderatorNotes: debate.moderatorNotes,
      tags: debate.tags || []
    };

    try {
      const result = await EnhancedDebateHistoryService.saveDebateSession(completeDebate);
      if (result) {
        console.log(`Debate saved successfully: ${roomId} -> ${result}`);
        
        // Remove from active debates if completed
        if (completeDebate.status === 'completed') {
          this.activeDebates.delete(roomId);
        }
        
        return true;
      }
    } catch (error) {
      console.error(`Error saving debate ${roomId}:`, error);
    }
    
    return false;
  }

  /**
   * Save all active debates
   */
  async saveAllActiveDebates(): Promise<number> {
    let savedCount = 0;
    const roomIds = Array.from(this.activeDebates.keys());
    
    for (const roomId of roomIds) {
      const success = await this.saveDebate(roomId);
      if (success) savedCount++;
    }
    
    return savedCount;
  }

  /**
   * Get current debate data (for debugging)
   */
  getDebateData(roomId: string): Partial<HumanDebateRecord> | null {
    return this.activeDebates.get(roomId) || null;
  }

  /**
   * Import existing debate from localStorage
   */
  importExistingDebate(roomId: string): boolean {
    try {
      // Try to reconstruct debate from existing localStorage data
      const messagesKey = `debate_room_${roomId}_messages`;
      const participantsKey = `debate_room_${roomId}_participants`;
      const roomInfoKey = `debate_room_${roomId}_info`;
      
      const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
      const participants = JSON.parse(localStorage.getItem(participantsKey) || '[]');
      const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');
      
      if (roomInfo.topic) {
        const debate: Partial<HumanDebateRecord> = {
          id: this.generateDebateId(),
          roomId: roomId,
          topic: roomInfo.topic,
          hostName: roomInfo.hostName || roomInfo.host || 'Unknown Host',
          status: roomInfo.status || 'active',
          createdAt: roomInfo.createdAt || new Date().toISOString(),
          endedAt: roomInfo.endedAt,
          winner: roomInfo.winner,
          moderatorNotes: roomInfo.moderatorNotes,
          tags: roomInfo.tags || [],
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
          }))
        };
        
        this.activeDebates.set(roomId, debate);
        console.log(`Imported existing debate: ${roomId} - ${debate.topic}`);
        return true;
      }
    } catch (error) {
      console.error(`Error importing existing debate ${roomId}:`, error);
    }
    
    return false;
  }

  /**
   * Clean up inactive debates
   */
  cleanupInactiveDebates(): void {
    const now = Date.now();
    const maxInactiveTime = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [roomId, debate] of this.activeDebates.entries()) {
      const createdTime = new Date(debate.createdAt || now).getTime();
      
      if (now - createdTime > maxInactiveTime && debate.status !== 'completed') {
        console.log(`Cleaning up inactive debate: ${roomId}`);
        this.updateDebateStatus(roomId, 'completed');
      }
    }
  }

  private generateDebateId(): string {
    return `debate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startAutoSave(): void {
    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.cleanupInactiveDebates();
      // Only save debates that have messages
      for (const [roomId, debate] of this.activeDebates.entries()) {
        if (debate.messages && debate.messages.length > 0) {
          this.saveDebate(roomId);
        }
      }
    }, 30000);
  }

  /**
   * Stop auto-save (cleanup)
   */
  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
    
    // Save all remaining debates
    this.saveAllActiveDebates();
  }
}

// Create global instance
export const debateAutoSaver = DebateAutoSaver.getInstance();

export default DebateAutoSaver;
