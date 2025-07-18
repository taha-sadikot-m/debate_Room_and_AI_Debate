-- Force Supabase schema cache refresh
-- Run this in your Supabase SQL Editor to refresh the schema cache

-- Step 1: Force a schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Step 2: Grant explicit permissions to ensure the API can access the table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.debate_topics TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 3: Refresh the schema cache by updating a system table
-- This forces PostgREST to reload its schema cache
SELECT pg_notify('pgrst', 'reload schema');

-- Step 4: Verify table permissions and structure
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename = 'debate_topics';

-- Step 5: Check column information
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'debate_topics' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 6: Verify RLS is properly configured
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'debate_topics';

-- Step 7: List current policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'debate_topics';

-- Step 8: Insert a test record to verify everything works
INSERT INTO public.debate_topics (
    topic_name,
    category,
    description,
    theme,
    status
) VALUES (
    'Test Topic - Schema Cache Refresh',
    'Technology',
    'This is a test topic to verify schema cache refresh',
    'Technology',
    'active'
) ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Schema cache refresh completed successfully!' as message;
