import { TemporaryDebateHistoryService } from '@/services/temporaryDebateHistoryService';
import type { HumanDebateRecord } from '@/types/debate';

/**
 * Utility functions for setting up and managing the temporary debate history system
 */
export class DebateHistorySetup {
  /**
   * Initialize the temporary system with sample data if needed
   */
  static async initializeWithSampleData(): Promise<void> {
    try {
      TemporaryDebateHistoryService.initialize();
      
      const stats = TemporaryDebateHistoryService.getStorageStats();
      if (stats.totalDebates === 0) {
        console.log('🚀 No existing debates found, creating sample data...');
        await TemporaryDebateHistoryService.createSampleData();
        console.log('✅ Sample data created successfully');
      } else {
        console.log(`📚 Found ${stats.totalDebates} existing debates`);
      }
    } catch (error) {
      console.error('Error initializing with sample data:', error);
    }
  }

  /**
   * Migrate data from the old storage systems to temporary storage
   */
  static async migrateExistingData(): Promise<{ migrated: number; failed: number }> {
    try {
      TemporaryDebateHistoryService.initialize();
      
      let migrated = 0;
      let failed = 0;
      
      // Check for data in localStorage with various prefixes
      const prefixes = [
        'debate_room_',
        'enhanced_debate_',
        'instant_debates'
      ];
      
      prefixes.forEach(prefix => {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(prefix)) {
            try {
              const data = localStorage.getItem(key);
              if (data) {
                const parsed = JSON.parse(data);
                
                // Try to convert to HumanDebateRecord format
                let debate: HumanDebateRecord;
                
                if (prefix === 'instant_debates') {
                  // Handle instant debates array
                  if (Array.isArray(parsed)) {
                    parsed.forEach(async (item: any) => {
                      const converted = this.convertInstantDebateToHuman(item);
                      if (converted) {
                        await TemporaryDebateHistoryService.saveDebate(converted);
                        migrated++;
                      } else {
                        failed++;
                      }
                    });
                  }
                } else if (parsed.topic && parsed.messages) {
                  // Already in correct format or can be easily converted
                  debate = this.normalizeDebateRecord(parsed);
                  TemporaryDebateHistoryService.saveDebate(debate);
                  migrated++;
                }
              }
            } catch (error) {
              console.warn(`Failed to migrate ${key}:`, error);
              failed++;
            }
          }
        });
      });
      
      console.log(`📦 Migration complete: ${migrated} migrated, ${failed} failed`);
      return { migrated, failed };
    } catch (error) {
      console.error('Error during migration:', error);
      return { migrated: 0, failed: 0 };
    }
  }

  /**
   * Convert instant debate format to human debate format
   */
  private static convertInstantDebateToHuman(instantDebate: any): HumanDebateRecord | null {
    try {
      if (!instantDebate.topic || !instantDebate.messages) {
        return null;
      }

      const debate: HumanDebateRecord = {
        id: instantDebate.id || `converted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId: instantDebate.roomId || `room_${Date.now()}`,
        topic: instantDebate.topic,
        hostName: 'AI Debate System',
        participants: [
          {
            id: 'user_participant',
            name: 'User',
            side: instantDebate.userPosition === 'for' ? 'FOR' : 'AGAINST',
            joinedAt: instantDebate.createdAt || new Date().toISOString(),
            isActive: false,
            lastSeen: instantDebate.createdAt || new Date().toISOString()
          },
          {
            id: 'ai_participant',
            name: 'AI Assistant',
            side: instantDebate.aiPosition === 'for' ? 'FOR' : 'AGAINST',
            joinedAt: instantDebate.createdAt || new Date().toISOString(),
            isActive: false,
            lastSeen: instantDebate.createdAt || new Date().toISOString()
          }
        ],
        messages: instantDebate.messages.map((msg: any, index: number) => ({
          id: msg.id || `msg_${index}`,
          senderId: msg.speaker === 'user' ? 'user_participant' : 'ai_participant',
          senderName: msg.speaker === 'user' ? 'User' : 'AI Assistant',
          text: msg.text,
          side: msg.speaker === 'user' 
            ? (instantDebate.userPosition === 'for' ? 'FOR' : 'AGAINST')
            : (instantDebate.aiPosition === 'for' ? 'FOR' : 'AGAINST'),
          timestamp: msg.timestamp || new Date().toISOString()
        })),
        createdAt: instantDebate.createdAt || new Date().toISOString(),
        endedAt: instantDebate.endedAt || new Date().toISOString(),
        status: 'completed',
        tags: ['converted', 'instant-debate']
      };

      return debate;
    } catch (error) {
      console.error('Error converting instant debate:', error);
      return null;
    }
  }

  /**
   * Normalize a debate record to ensure it has all required fields
   */
  private static normalizeDebateRecord(record: any): HumanDebateRecord {
    return {
      id: record.id || `normalized_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId: record.roomId || record.id || `room_${Date.now()}`,
      topic: record.topic || 'Unknown Topic',
      hostName: record.hostName || record.host || 'Unknown Host',
      participants: Array.isArray(record.participants) ? record.participants.map((p: any) => ({
        id: p.id || `participant_${Math.random().toString(36).substr(2, 9)}`,
        name: p.name || 'Unknown',
        side: p.side || 'OBSERVER',
        joinedAt: p.joinedAt || record.createdAt || new Date().toISOString(),
        leftAt: p.leftAt,
        isActive: p.isActive !== undefined ? p.isActive : false,
        lastSeen: p.lastSeen || p.joinedAt || new Date().toISOString()
      })) : [],
      messages: Array.isArray(record.messages) ? record.messages.map((m: any, index: number) => ({
        id: m.id || `msg_${index}`,
        senderId: m.senderId || m.sender || 'unknown',
        senderName: m.senderName || m.name || 'Unknown',
        text: m.text || m.message || '',
        side: m.side || 'OBSERVER',
        timestamp: m.timestamp || new Date().toISOString()
      })) : [],
      createdAt: record.createdAt || new Date().toISOString(),
      endedAt: record.endedAt,
      status: record.status || 'completed',
      winner: record.winner,
      moderatorNotes: record.moderatorNotes,
      tags: Array.isArray(record.tags) ? record.tags : ['normalized']
    };
  }

  /**
   * Create detailed sample data for testing
   */
  static async createRichSampleData(): Promise<void> {
    try {
      const sampleDebates: HumanDebateRecord[] = [
        {
          id: 'sample_climate_change',
          roomId: 'room_climate_2024',
          topic: 'Should governments implement carbon taxes to combat climate change?',
          hostName: 'Dr. Sarah Chen',
          participants: [
            {
              id: 'user_sarah',
              name: 'Dr. Sarah Chen',
              side: 'FOR',
              joinedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            },
            {
              id: 'user_mike',
              name: 'Mike Rodriguez',
              side: 'AGAINST',
              joinedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            },
            {
              id: 'user_alex',
              name: 'Alex Thompson',
              side: 'OBSERVER',
              joinedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            }
          ],
          messages: [
            {
              id: 'msg_climate_1',
              senderId: 'user_sarah',
              senderName: 'Dr. Sarah Chen',
              text: 'Carbon taxes create market incentives for cleaner technologies and generate revenue for green infrastructure. The evidence from countries like Canada shows they can be effective.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_climate_2',
              senderId: 'user_mike',
              senderName: 'Mike Rodriguez',
              text: 'Carbon taxes burden working families and small businesses while large corporations can afford to pay and continue polluting. We need regulation, not regressive taxation.',
              side: 'AGAINST',
              timestamp: new Date(Date.now() - 115 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_climate_3',
              senderId: 'user_alex',
              senderName: 'Alex Thompson',
              text: 'Both arguments have merit. Have either of you considered hybrid approaches that combine carbon pricing with strong social safety nets?',
              side: 'OBSERVER',
              timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_climate_4',
              senderId: 'user_sarah',
              senderName: 'Dr. Sarah Chen',
              text: 'That\'s exactly what we need! Carbon tax revenue should fund universal basic income or tax credits for lower-income households. British Columbia did this successfully.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_climate_5',
              senderId: 'user_mike',
              senderName: 'Mike Rodriguez',
              text: 'Even with rebates, carbon taxes drive up costs across the economy. Energy, transportation, food - everything gets more expensive. Direct investment in clean energy creates jobs and solutions.',
              side: 'AGAINST',
              timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          endedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          status: 'completed',
          winner: 'DRAW',
          tags: ['climate', 'environment', 'policy', 'economics']
        },
        {
          id: 'sample_remote_work',
          roomId: 'room_remote_2024',
          topic: 'Is remote work better for employee productivity and well-being?',
          hostName: 'Jennifer Kim',
          participants: [
            {
              id: 'user_jen',
              name: 'Jennifer Kim',
              side: 'FOR',
              joinedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            },
            {
              id: 'user_david',
              name: 'David Wilson',
              side: 'AGAINST',
              joinedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              lastSeen: new Date().toISOString()
            }
          ],
          messages: [
            {
              id: 'msg_remote_1',
              senderId: 'user_jen',
              senderName: 'Jennifer Kim',
              text: 'Remote work eliminates commute stress, allows for better work-life balance, and studies show most employees are more productive at home with fewer office distractions.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_remote_2',
              senderId: 'user_david',
              senderName: 'David Wilson',
              text: 'While individual tasks might get done faster, collaboration suffers. Innovation happens in spontaneous hallway conversations. Remote work creates isolation and communication barriers.',
              side: 'AGAINST',
              timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_remote_3',
              senderId: 'user_jen',
              senderName: 'Jennifer Kim',
              text: 'That\'s a fair point about collaboration, but modern tools like Slack, Zoom, and virtual whiteboards can facilitate great teamwork. Plus, remote workers report higher job satisfaction.',
              side: 'FOR',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg_remote_4',
              senderId: 'user_david',
              senderName: 'David Wilson',
              text: 'Job satisfaction is important, but what about career development? Junior employees need mentorship and learning opportunities that are harder to provide remotely.',
              side: 'AGAINST',
              timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          endedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'completed',
          winner: 'FOR',
          tags: ['workplace', 'productivity', 'technology', 'well-being']
        }
      ];

      for (const debate of sampleDebates) {
        await TemporaryDebateHistoryService.saveDebate(debate);
      }

      console.log('✅ Rich sample data created successfully');
    } catch (error) {
      console.error('Error creating rich sample data:', error);
    }
  }

  /**
   * Quick setup function for development/testing
   */
  static async quickSetup(): Promise<void> {
    console.log('🚀 Starting Temporary Debate History System setup...');
    
    try {
      // Initialize the system
      TemporaryDebateHistoryService.initialize();
      
      // Check if we have existing data
      const stats = TemporaryDebateHistoryService.getStorageStats();
      console.log(`📊 Current storage: ${stats.totalDebates} debates, ${stats.storageSize}`);
      
      // Migrate existing data if found
      const migration = await this.migrateExistingData();
      if (migration.migrated > 0) {
        console.log(`📦 Migrated ${migration.migrated} existing debates`);
      }
      
      // Create sample data if we have very few debates
      const updatedStats = TemporaryDebateHistoryService.getStorageStats();
      if (updatedStats.totalDebates < 3) {
        await this.createRichSampleData();
        console.log('📚 Added rich sample data');
      }
      
      const finalStats = TemporaryDebateHistoryService.getStorageStats();
      console.log(`✅ Setup complete! ${finalStats.totalDebates} debates ready, using ${finalStats.storageSize}`);
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
    }
  }
}

export default DebateHistorySetup;
