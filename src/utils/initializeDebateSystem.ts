import DebateHistorySetup from '@/utils/debateHistorySetup';

/**
 * Initialize the temporary debate history system on app startup
 */
export const initializeDebateSystem = async (): Promise<void> => {
  try {
    console.log('🚀 Initializing Debate System...');
    
    // Run the quick setup which handles migration and sample data
    await DebateHistorySetup.quickSetup();
    
    console.log('✅ Debate System initialization complete');
  } catch (error) {
    console.error('❌ Failed to initialize debate system:', error);
  }
};

// Auto-initialize when this module is imported
// Comment this out if you prefer manual initialization
initializeDebateSystem();

export default initializeDebateSystem;
