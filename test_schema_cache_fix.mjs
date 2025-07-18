// Test script to verify Supabase schema cache fix
// Run this after applying the emergency schema fix

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dynelmjgdqjzwtrpxttx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmVsbWpnZHFqend0cnB4dHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjQzOTEsImV4cCI6MjA0ODc0MDM5MX0.hpZiJN5iIgGFP0VGDO68WnAyONf-2KTFRQzMn0y-bEQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSchemaFix() {
  console.log('🔍 Testing Supabase schema cache fix...\n');

  try {
    // Test 1: Check if we can read existing topics
    console.log('Test 1: Reading existing topics...');
    const { data: existingTopics, error: readError } = await supabase
      .from('debate_topics')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('❌ Read test failed:', readError.message);
      return false;
    } else {
      console.log('✅ Read test passed! Found', existingTopics.length, 'topics');
      console.log('   Sample topic:', existingTopics[0]?.topic_name || 'None found');
    }

    // Test 2: Try to create a new topic with category
    console.log('\nTest 2: Creating new topic with category...');
    const testTopic = {
      topic_name: 'Schema Cache Test Topic',
      category: 'Testing',
      description: 'This topic tests if the category column is recognized',
      theme: 'Testing',
      status: 'active'
    };

    const { data: newTopic, error: createError } = await supabase
      .from('debate_topics')
      .insert([testTopic])
      .select()
      .single();

    if (createError) {
      console.error('❌ Create test failed:', createError.message);
      if (createError.message.includes('category')) {
        console.error('   🚨 SCHEMA CACHE STILL NOT REFRESHED!');
        console.error('   📋 Please wait 2-3 minutes and try again');
        console.error('   🔄 Or restart your Supabase project');
      }
      return false;
    } else {
      console.log('✅ Create test passed! New topic created with ID:', newTopic.id);
      console.log('   📊 Category field working:', newTopic.category);
    }

    // Test 3: Try to update the topic
    console.log('\nTest 3: Updating topic...');
    const { data: updatedTopic, error: updateError } = await supabase
      .from('debate_topics')
      .update({ category: 'Updated Testing' })
      .eq('id', newTopic.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update test failed:', updateError.message);
      return false;
    } else {
      console.log('✅ Update test passed! Category updated to:', updatedTopic.category);
    }

    // Test 4: Clean up test topic
    console.log('\nTest 4: Cleaning up test topic...');
    const { error: deleteError } = await supabase
      .from('debate_topics')
      .delete()
      .eq('id', newTopic.id);

    if (deleteError) {
      console.error('❌ Delete test failed:', deleteError.message);
      console.log('   ℹ️  Test topic left in database with ID:', newTopic.id);
    } else {
      console.log('✅ Delete test passed! Test topic cleaned up');
    }

    console.log('\n🎉 ALL TESTS PASSED! Schema cache fix successful!');
    console.log('✅ Your app should now work without the "category column not found" error');
    return true;

  } catch (error) {
    console.error('❌ Test failed with unexpected error:', error.message);
    return false;
  }
}

// Run the test
testSchemaFix().then(success => {
  if (success) {
    console.log('\n🚀 You can now use your debate app successfully!');
  } else {
    console.log('\n❌ Schema fix may need more time or additional steps');
    console.log('📋 Check the EMERGENCY_CACHE_FIX_INSTRUCTIONS.md for next steps');
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});
