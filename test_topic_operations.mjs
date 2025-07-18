// Test script to verify Supabase topic operations
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dynelmjgdqjzwtrpxttx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmVsbWpnZHFqend0cnB4dHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzA4NzksImV4cCI6MjA2NTMwNjg3OX0.mz1q_H9ti9hAXOk2lOAY4vqgzxbPu-Pjf0V7hCpZzL4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testTopicOperations() {
  console.log('🧪 Testing Supabase Topic Operations...\n');

  // Test 1: Check authentication
  console.log('1. Testing Authentication...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.log('❌ No authenticated user found');
    console.log('   You need to sign in first');
    
    // Try to sign in with test user
    console.log('   Attempting to sign in with test user...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'testuser@mydebate.ai',
      password: 'TestPass123!'
    });
    
    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
      console.log('   Please create a test user first or sign in manually');
      return;
    } else {
      console.log('✅ Signed in successfully as:', signInData.user?.email);
    }
  } else {
    console.log('✅ Authenticated as:', user.email);
  }

  // Test 2: Try to read topics
  console.log('\n2. Testing Topic Read Access...');
  const { data: topics, error: readError } = await supabase
    .from('debate_topics')
    .select('*')
    .limit(5);

  if (readError) {
    console.log('❌ Read error:', readError.message);
  } else {
    console.log('✅ Successfully read topics:', topics?.length || 0, 'topics found');
  }

  // Test 3: Try to insert a topic
  console.log('\n3. Testing Topic Insert...');
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  
  const testTopic = {
    topic_name: 'Test Topic: AI Ethics in Education',
    category: 'Technology',
    theme: 'Technology',
    description: 'A test topic about AI ethics in educational settings',
    student_id: currentUser?.id,
    status: 'pending'
  };

  const { data: insertData, error: insertError } = await supabase
    .from('debate_topics')
    .insert(testTopic)
    .select()
    .single();

  if (insertError) {
    console.log('❌ Insert error:', insertError.message);
    console.log('   Code:', insertError.code);
    console.log('   Details:', insertError.details);
    console.log('   Hint:', insertError.hint);
  } else {
    console.log('✅ Successfully inserted topic:', insertData.topic_name);
    
    // Clean up: delete the test topic
    const { error: deleteError } = await supabase
      .from('debate_topics')
      .delete()
      .eq('id', insertData.id);
    
    if (!deleteError) {
      console.log('✅ Test topic cleaned up');
    }
  }

  // Test 4: Test suggested topics
  console.log('\n4. Testing Suggested Topics...');
  const { data: suggestedData, error: suggestedError } = await supabase
    .from('suggested_topics')
    .insert({
      topic_name: 'Test Suggested Topic',
      theme: 'Test',
      user_id: currentUser?.id,
      status: 'pending'
    })
    .select()
    .single();

  if (suggestedError) {
    console.log('❌ Suggested topics error:', suggestedError.message);
  } else {
    console.log('✅ Successfully created suggested topic');
    
    // Clean up
    await supabase.from('suggested_topics').delete().eq('id', suggestedData.id);
    console.log('✅ Suggested topic cleaned up');
  }

  console.log('\n🎯 Test completed!');
}

// Run the test
testTopicOperations().catch(console.error);
