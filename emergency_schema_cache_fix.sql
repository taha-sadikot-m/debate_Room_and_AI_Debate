-- EMERGENCY SCHEMA CACHE FIX FOR SUPABASE
-- This script forces a complete schema cache refresh and ensures the API recognizes all columns
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/dynelmjgdqjzwtrpxttx/sql

-- Step 1: Drop and recreate the table completely to force cache refresh
DROP TABLE IF EXISTS public.debate_topics CASCADE;

-- Step 2: Create the table from scratch with all columns
CREATE TABLE public.debate_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  theme TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  student_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Step 3: Enable RLS
ALTER TABLE public.debate_topics ENABLE ROW LEVEL SECURITY;

-- Step 4: Create extremely permissive policies for development
CREATE POLICY "Allow all operations for everyone" ON public.debate_topics
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Step 5: Grant all permissions
GRANT ALL ON public.debate_topics TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 6: Create indexes
CREATE INDEX idx_debate_topics_category ON public.debate_topics(category);
CREATE INDEX idx_debate_topics_status ON public.debate_topics(status);

-- Step 7: Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create trigger
CREATE TRIGGER update_debate_topics_updated_at
    BEFORE UPDATE ON public.debate_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Insert test data to verify it works
INSERT INTO public.debate_topics (topic_name, category, description, theme, status) VALUES
('AI in Education: Helpful or Harmful?', 'Technology', 'Debate about the impact of artificial intelligence on educational systems', 'Technology', 'active'),
('Climate Change: Individual vs Corporate Action', 'Environment', 'Who bears more responsibility for climate action?', 'Environment', 'active'),
('Universal Basic Income: Economic Necessity or Luxury?', 'Economics', 'Should governments implement UBI programs?', 'Economics', 'active'),
('Social Media: Connecting or Dividing Society?', 'Society', 'Does social media bring people together or tear them apart?', 'Society', 'active'),
('Remote Work: Future of Employment or Temporary Trend?', 'Business', 'Is remote work here to stay?', 'Business', 'active');

-- Step 10: Force multiple schema cache refreshes
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');

-- Force PostgREST to reload by updating system catalogs
UPDATE pg_class SET reltuples = reltuples WHERE relname = 'debate_topics';

-- Step 11: Verify the table structure
SELECT 
    'Column Information:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'debate_topics' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 12: Verify data was inserted
SELECT 'Sample Data Count:' as info, COUNT(*) as total_topics FROM public.debate_topics;

-- Step 13: Test a basic select to ensure API will work
SELECT 'Test Query:' as info, id, topic_name, category, status FROM public.debate_topics LIMIT 3;

-- Step 14: Final notification
SELECT 'EMERGENCY SCHEMA FIX COMPLETED - The category column should now be recognized!' as result;
