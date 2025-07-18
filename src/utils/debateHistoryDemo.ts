import { EnhancedDebateHistoryService } from '../services/enhancedDebateHistoryService';
import { debateAutoSaver } from '../services/debateAutoSaver';
import type { HumanDebateRecord } from '../types/debate';

/**
 * Enhanced Debate History Demo and Testing Utilities
 * This module provides functions to test and demonstrate the enhanced storage system
 */
export class DebateHistoryDemo {
  
  /**
   * Initialize the enhanced storage system and create sample data
   */
  static async initializeDemoData(): Promise<void> {
    console.log('🚀 Initializing Enhanced Debate History Demo...');
    
    // Initialize storage
    EnhancedDebateHistoryService.initializeStorage();
    
    // Create sample debates
    const sampleDebates = this.generateSampleDebates();
    
    for (const debate of sampleDebates) {
      await EnhancedDebateHistoryService.saveDebateSession(debate);
    }
    
    console.log(`✅ Created ${sampleDebates.length} sample debates`);
    
    // Display storage stats
    const stats = EnhancedDebateHistoryService.getStorageStats();
    console.log('📊 Storage Statistics:', stats);
  }

  /**
   * Generate sample debate data for testing
   */
  static generateSampleDebates(): HumanDebateRecord[] {
    const topics = [
      "Should artificial intelligence be regulated by government?",
      "Is social media doing more harm than good to society?",
      "Should university education be free for everyone?",
      "Is nuclear energy the key to solving climate change?",
      "Should performance-enhancing drugs be allowed in sports?"
    ];

    const hosts = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
    
    const sides = ['FOR', 'AGAINST', 'OBSERVER', 'EVALUATOR'] as const;
    
    return topics.map((topic, index) => {
      const roomId = `DEMO${(index + 1).toString().padStart(2, '0')}`;
      const createdAt = new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString();
      const endedAt = new Date(Date.now() - (index * 24 * 60 * 60 * 1000) + (45 * 60 * 1000)).toISOString();
      
      // Generate participants
      const participants = Array.from({ length: Math.floor(Math.random() * 6) + 3 }, (_, i) => ({
        id: `participant_${roomId}_${i + 1}`,
        name: `User ${i + 1}`,
        side: sides[Math.floor(Math.random() * sides.length)],
        joinedAt: createdAt,
        leftAt: i === 0 ? undefined : endedAt, // Host stays until end
        isActive: i === 0, // Only host is still active
        lastSeen: endedAt
      }));

      // Generate messages
      const messages = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, i) => {
        const participant = participants[Math.floor(Math.random() * participants.length)];
        return {
          id: `msg_${roomId}_${i + 1}`,
          senderId: participant.id,
          senderName: participant.name,
          text: this.generateSampleMessage(participant.side, i),
          side: participant.side,
          timestamp: new Date(new Date(createdAt).getTime() + (i * 2 * 60 * 1000)).toISOString()
        };
      });

      const winners = ['FOR', 'AGAINST', 'DRAW'] as const;
      
      return {
        id: `debate_demo_${Date.now()}_${index}`,
        roomId,
        topic,
        hostName: hosts[index],
        participants,
        messages,
        createdAt,
        endedAt,
        status: 'completed' as const,
        winner: winners[Math.floor(Math.random() * winners.length)],
        moderatorNotes: `Demo debate #${index + 1}. Generated for testing enhanced storage.`,
        tags: ['demo', 'sample', topic.includes('AI') ? 'technology' : 'general']
      };
    });
  }

  /**
   * Generate sample message based on side and message index
   */
  static generateSampleMessage(side: string, index: number): string {
    const forMessages = [
      "I strongly support this position because...",
      "The evidence clearly shows that...",
      "We must consider the benefits of...",
      "Research indicates that...",
      "This approach would lead to positive outcomes...",
      "The economic benefits are substantial...",
      "History has shown us that...",
      "This is the right direction for society..."
    ];

    const againstMessages = [
      "I disagree with this viewpoint because...",
      "The risks outweigh the benefits...",
      "This approach has serious flaws...",
      "We need to consider the negative consequences...",
      "This could lead to unintended problems...",
      "The costs are too high...",
      "There are better alternatives...",
      "This goes against our principles..."
    ];

    const observerMessages = [
      "Interesting point raised by both sides...",
      "I'd like to hear more about...",
      "Could you clarify what you mean by...",
      "That's a compelling argument...",
      "I'm curious about the long-term implications...",
      "Both perspectives have merit...",
      "This is a complex issue...",
      "Thank you for sharing that insight..."
    ];

    const evaluatorMessages = [
      "Strong argument with good evidence...",
      "That point needs more supporting data...",
      "Well-structured reasoning...",
      "Consider addressing the counterargument...",
      "Good use of examples...",
      "That was persuasive...",
      "Needs more logical connection...",
      "Excellent rebuttal..."
    ];

    let messagePool: string[] = [];
    
    switch (side) {
      case 'FOR':
        messagePool = forMessages;
        break;
      case 'AGAINST':
        messagePool = againstMessages;
        break;
      case 'OBSERVER':
        messagePool = observerMessages;
        break;
      case 'EVALUATOR':
        messagePool = evaluatorMessages;
        break;
      default:
        messagePool = observerMessages;
    }

    return messagePool[index % messagePool.length];
  }

  /**
   * Test the auto-saver functionality
   */
  static async testAutoSaver(): Promise<void> {
    console.log('🧪 Testing Auto-Saver functionality...');
    
    const roomId = 'TEST001';
    const topic = 'Testing Enhanced Storage System';
    const hostName = 'Test Host';

    // Register a new debate
    debateAutoSaver.registerDebate(roomId, { topic, hostName });
    console.log('✅ Debate registered');

    // Add participants
    debateAutoSaver.addParticipant(roomId, {
      id: 'host_001',
      name: 'Test Host',
      side: 'FOR'
    });
    
    debateAutoSaver.addParticipant(roomId, {
      id: 'participant_001',
      name: 'Test Participant',
      side: 'AGAINST'
    });
    console.log('✅ Participants added');

    // Add some messages
    debateAutoSaver.addMessage(roomId, {
      senderId: 'host_001',
      senderName: 'Test Host',
      text: 'Welcome to our enhanced storage test!',
      side: 'FOR'
    });

    debateAutoSaver.addMessage(roomId, {
      senderId: 'participant_001',
      senderName: 'Test Participant',
      text: 'This is a test message from the participant.',
      side: 'AGAINST'
    });
    console.log('✅ Messages added');

    // Update status
    debateAutoSaver.updateDebateStatus(roomId, 'completed', 'FOR');
    console.log('✅ Status updated');

    // Save the debate
    const saved = await debateAutoSaver.saveDebate(roomId);
    console.log(`✅ Debate saved: ${saved}`);

    // Get the data
    const data = debateAutoSaver.getDebateData(roomId);
    console.log('📄 Debate data:', data);
  }

  /**
   * Demonstrate the search functionality
   */
  static async testSearchFunctionality(): Promise<void> {
    console.log('🔍 Testing Search functionality...');
    
    // Search for AI-related debates
    const aiDebates = await EnhancedDebateHistoryService.searchDebates('artificial intelligence');
    console.log(`Found ${aiDebates.length} AI-related debates`);

    // Search for completed debates
    const allDebates = await EnhancedDebateHistoryService.getUserDebateHistory();
    const completedDebates = allDebates.filter(d => d.status === 'completed');
    console.log(`Found ${completedDebates.length} completed debates`);

    // Search by host name
    const aliceDebates = await EnhancedDebateHistoryService.searchDebates('Alice');
    console.log(`Found ${aliceDebates.length} debates hosted by Alice`);
  }

  /**
   * Test export and import functionality
   */
  static async testExportImport(): Promise<void> {
    console.log('💾 Testing Export/Import functionality...');
    
    // Get all debates
    const debates = await EnhancedDebateHistoryService.getUserDebateHistory();
    console.log(`Exporting ${debates.length} debates...`);

    // Export to JSON
    const exportData = EnhancedDebateHistoryService.exportDebateData(debates);
    console.log('✅ Export completed');

    // Test import (would normally be from a file)
    const imported = await EnhancedDebateHistoryService.importDebateData(exportData);
    console.log(`✅ Import completed: ${imported}`);
  }

  /**
   * Display storage statistics
   */
  static displayStorageStats(): void {
    const stats = EnhancedDebateHistoryService.getStorageStats();
    console.log('📊 Enhanced Storage Statistics:');
    console.log(`  Total Debates: ${stats.totalDebates}`);
    console.log(`  Storage Size: ${stats.storageSize}`);
    console.log(`  Version: ${stats.version}`);
    if (stats.oldestDebate) {
      console.log(`  Oldest Debate: ${new Date(stats.oldestDebate).toLocaleDateString()}`);
    }
    if (stats.newestDebate) {
      console.log(`  Newest Debate: ${new Date(stats.newestDebate).toLocaleDateString()}`);
    }
  }

  /**
   * Run all demo tests
   */
  static async runFullDemo(): Promise<void> {
    console.log('🎬 Running Full Enhanced Debate History Demo...');
    
    try {
      await this.initializeDemoData();
      await this.testAutoSaver();
      await this.testSearchFunctionality();
      await this.testExportImport();
      this.displayStorageStats();
      
      console.log('🎉 Demo completed successfully!');
      console.log('💡 You can now view the enhanced debate history in your app.');
    } catch (error) {
      console.error('❌ Demo failed:', error);
    }
  }

  /**
   * Clean up demo data
   */
  static async cleanupDemo(): Promise<void> {
    console.log('🧹 Cleaning up demo data...');
    
    const confirmed = window.confirm(
      'This will delete all demo debate data. Are you sure?'
    );
    
    if (confirmed) {
      await EnhancedDebateHistoryService.clearAllHistory();
      console.log('✅ Demo data cleaned up');
    }
  }
}

// Make it available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).DebateHistoryDemo = DebateHistoryDemo;
}

export default DebateHistoryDemo;
