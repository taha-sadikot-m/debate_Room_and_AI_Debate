import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dynelmjgdqjzwtrpxttx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmVsbWpnZHFqend0cnB4dHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzA4NzksImV4cCI6MjA2NTMwNjg3OX0.mz1q_H9ti9hAXOk2lOAY4vqgzxbPu-Pjf0V7hCpZzL4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Sign up a new user
    const { data, error } = await supabase.auth.signUp({
      email: 'testuser@mydebate.ai',
      password: 'TestPass123!',
      options: {
        data: {
          full_name: 'Test Student'
        }
      }
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('Test user created successfully!');
    console.log('Email: testuser@mydebate.ai');
    console.log('Password: TestPass123!');
    console.log('Full Name: Test Student');
    
    if (data.user) {
      console.log('User ID:', data.user.id);
      
      // Check if email confirmation is required
      if (!data.user.email_confirmed_at) {
        console.log('\n⚠️  IMPORTANT: Email confirmation may be required.');
        console.log('Check your Supabase dashboard to confirm the user or disable email confirmation.');
      }
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTestUser();
