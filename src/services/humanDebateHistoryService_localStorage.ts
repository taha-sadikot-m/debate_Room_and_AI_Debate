import type { HumanDebateRecord, Participant, ChatMessage } from '../types/debate';

export class HumanDebateHistoryService {
  /**
   * Get user's debate history from localStorage
   */
  static async getUserDebateHistory(userId?: string): Promise<HumanDebateRecord[]> {
    try {
      // For now, we'll work with localStorage until the database migration is run
      return this.getLocalStorageDebateHistory();
    } catch (error) {
      console.error('Error in getUserDebateHistory:', error);
      return [];
    }
  }

  /**
   * Save a complete human debate session to localStorage
   */
  static async saveDebateSession(debate: HumanDebateRecord): Promise<string | null> {
    try {
      // Save to localStorage for now
      const roomId = debate.roomId;
      
      // Save room info
      localStorage.setItem(`debate_room_${roomId}_info`, JSON.stringify({
        topic: debate.topic,
        hostName: debate.hostName,
        createdAt: debate.createdAt,
        endedAt: debate.endedAt,
        status: debate.status,
        winner: debate.winner,
        moderatorNotes: debate.moderatorNotes,
        tags: debate.tags || []
      }));

      // Save participants
      localStorage.setItem(`debate_room_${roomId}_participants`, JSON.stringify(debate.participants));

      // Save messages
      localStorage.setItem(`debate_room_${roomId}_messages`, JSON.stringify(debate.messages));

      return roomId;
    } catch (error) {
      console.error('Error in saveDebateSession:', error);
      return null;
    }
  }

  /**
   * Get all debate rooms from localStorage
   */
  static async getAllDebateRooms(): Promise<HumanDebateRecord[]> {
    return this.getLocalStorageDebateHistory();
  }

  /**
   * Get a specific debate by room ID from localStorage
   */
  static async getDebateByRoomId(roomId: string): Promise<HumanDebateRecord | null> {
    try {
      const messagesKey = `debate_room_${roomId}_messages`;
      const participantsKey = `debate_room_${roomId}_participants`;
      const roomInfoKey = `debate_room_${roomId}_info`;

      const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
      const participants = JSON.parse(localStorage.getItem(participantsKey) || '[]');
      const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');

      if (!roomInfo.topic) return null;

      return {
        id: roomId,
        roomId: roomId,
        topic: roomInfo.topic,
        hostName: roomInfo.hostName || 'Unknown Host',
        participants: participants.map((p: any) => ({
          id: p.id,
          name: p.name,
          side: p.side,
          joinedAt: p.joinedAt,
          leftAt: p.leftAt,
          isActive: p.isActive !== undefined ? p.isActive : true,
          lastSeen: p.lastSeen || p.joinedAt
        })),
        messages: messages.map((m: any, index: number) => ({
          id: m.id || `msg_${index}`,
          senderId: m.sender || m.senderId || 'unknown',
          senderName: m.senderName || m.name || 'Unknown',
          text: m.message || m.text || '',
          side: m.side || 'OBSERVER',
          timestamp: m.timestamp
        })),
        createdAt: roomInfo.createdAt,
        endedAt: roomInfo.endedAt,
        status: roomInfo.status || 'completed',
        winner: roomInfo.winner,
        moderatorNotes: roomInfo.moderatorNotes,
        tags: roomInfo.tags || []
      };
    } catch (error) {
      console.error('Error in getDebateByRoomId:', error);
      return null;
    }
  }

  /**
   * Search debates by topic or content in localStorage
   */
  static async searchDebates(query: string, userId?: string): Promise<HumanDebateRecord[]> {
    try {
      const allDebates = this.getLocalStorageDebateHistory();
      
      return allDebates.filter(debate => 
        debate.topic.toLowerCase().includes(query.toLowerCase()) ||
        debate.hostName.toLowerCase().includes(query.toLowerCase()) ||
        debate.participants.some(p => p.name.toLowerCase().includes(query.toLowerCase())) ||
        debate.messages.some(m => m.text.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Error in searchDebates:', error);
      return [];
    }
  }

  /**
   * Update debate status or outcome in localStorage
   */
  static async updateDebateStatus(roomId: string, status: 'waiting' | 'active' | 'completed', winner?: 'FOR' | 'AGAINST' | 'DRAW'): Promise<boolean> {
    try {
      const roomInfoKey = `debate_room_${roomId}_info`;
      const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');
      
      roomInfo.status = status;
      if (winner) roomInfo.winner = winner;
      if (status === 'completed') roomInfo.endedAt = new Date().toISOString();
      
      localStorage.setItem(roomInfoKey, JSON.stringify(roomInfo));
      return true;
    } catch (error) {
      console.error('Error in updateDebateStatus:', error);
      return false;
    }
  }

  /**
   * Sync localStorage data to database (placeholder for future implementation)
   */
  static async syncLocalStorageToDatabase(): Promise<void> {
    try {
      console.log('Database sync not yet implemented. Migration needs to be run first.');
      // TODO: Implement database sync after running the migration
    } catch (error) {
      console.error('Error syncing localStorage to database:', error);
    }
  }

  /**
   * Add a tag to a debate in localStorage
   */
  static async addTagToDebate(roomId: string, tagName: string): Promise<boolean> {
    try {
      const roomInfoKey = `debate_room_${roomId}_info`;
      const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');
      
      if (!roomInfo.tags) roomInfo.tags = [];
      if (!roomInfo.tags.includes(tagName)) {
        roomInfo.tags.push(tagName);
        localStorage.setItem(roomInfoKey, JSON.stringify(roomInfo));
      }
      
      return true;
    } catch (error) {
      console.error('Error in addTagToDebate:', error);
      return false;
    }
  }

  /**
   * Remove a tag from a debate in localStorage
   */
  static async removeTagFromDebate(roomId: string, tagName: string): Promise<boolean> {
    try {
      const roomInfoKey = `debate_room_${roomId}_info`;
      const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');
      
      if (roomInfo.tags) {
        roomInfo.tags = roomInfo.tags.filter((tag: string) => tag !== tagName);
        localStorage.setItem(roomInfoKey, JSON.stringify(roomInfo));
      }
      
      return true;
    } catch (error) {
      console.error('Error in removeTagFromDebate:', error);
      return false;
    }
  }

  /**
   * Helper method to get all debates from localStorage
   */
  private static getLocalStorageDebateHistory(): HumanDebateRecord[] {
    try {
      const roomIds = Object.keys(localStorage).filter(key => key.startsWith('debate_room_') && key.endsWith('_messages'));
      const debateRecords: HumanDebateRecord[] = [];

      roomIds.forEach(messageKey => {
        const roomId = messageKey.replace('debate_room_', '').replace('_messages', '');
        const messagesKey = `debate_room_${roomId}_messages`;
        const participantsKey = `debate_room_${roomId}_participants`;
        const roomInfoKey = `debate_room_${roomId}_info`;

        try {
          const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
          const participants = JSON.parse(localStorage.getItem(participantsKey) || '[]');
          const roomInfo = JSON.parse(localStorage.getItem(roomInfoKey) || '{}');

          const debateRecord: HumanDebateRecord = {
            id: roomId,
            roomId: roomId,
            topic: roomInfo.topic || 'Unknown Topic',
            hostName: roomInfo.hostName || roomInfo.host || 'Unknown Host',
            participants: participants.map((p: any) => ({
              id: p.id,
              name: p.name,
              side: p.side,
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

          debateRecords.push(debateRecord);
        } catch (parseError) {
          console.error(`Error parsing data for room ${roomId}:`, parseError);
        }
      });

      // Sort by creation date (newest first)
      return debateRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error in getLocalStorageDebateHistory:', error);
      return [];
    }
  }
}

// Export default service instance
export default HumanDebateHistoryService;
