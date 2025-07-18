// Temporary Development Authentication Helper
// Use this to simulate authentication for development/demo purposes

import { supabase } from '@/integrations/supabase/client';

export class DevAuthHelper {
  // Create a temporary anonymous session for development
  static async createTempSession() {
    try {
      // Check if already signed in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Already authenticated:', user.id);
        return user;
      }

      // Sign in anonymously for development
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Failed to create temp session:', error);
        return null;
      }

      console.log('Created temporary session:', data.user?.id);
      return data.user;
    } catch (error) {
      console.error('Error in createTempSession:', error);
      return null;
    }
  }

  // Initialize authentication on app start
  static async initDevAuth() {
    // Only run in development
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      console.log('🔧 Development mode: Creating temporary authentication session...');
      await this.createTempSession();
    }
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  DevAuthHelper.initDevAuth();
}
