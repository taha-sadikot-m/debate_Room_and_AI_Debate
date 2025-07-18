import { supabase } from './lib/supabase';

// Test script to verify Supabase topic functionality
async function testSupabaseTopics() {
  console.log('🧪 Testing Supabase topic functionality...');
  
  try {
    // Test 1: Check if table exists and has correct structure
    console.log('\n1. Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('debate_topics')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.error('❌ Table structure error:', tableError);
      return false;
    }
    console.log('✅ Table exists and is accessible');
    
    // Test 2: Try to insert a test topic
    console.log('\n2. Testing topic creation...');
    const testTopic = {
      topic_name: 'Test Topic - Should be deleted',
      category: 'test',
      description: 'This is a test topic that should be deleted after testing',
      theme: 'Testing',
      status: 'active'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('debate_topics')
      .insert(testTopic)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return false;
    }
    console.log('✅ Topic created successfully:', insertData);
    
    // Test 3: Try to fetch topics
    console.log('\n3. Testing topic retrieval...');
    const { data: topics, error: fetchError } = await supabase
      .from('debate_topics')
      .select('*')
      .eq('status', 'active')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return false;
    }
    console.log(`✅ Retrieved ${topics.length} topics`);
    
    // Test 4: Clean up test data
    console.log('\n4. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('debate_topics')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }
    
    console.log('\n🎉 All tests passed! Your Supabase topic integration is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testSupabaseTopics().then(success => {
  if (success) {
    console.log('\n✅ Schema fix was successful! You can now use the topic management features.');
  } else {
    console.log('\n❌ There are still issues. Please check the manual_schema_fix.sql has been applied correctly.');
  }
});
