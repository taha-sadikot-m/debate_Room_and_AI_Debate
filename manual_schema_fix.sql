-- Manual SQL fix for Supabase debate_topics schema issues
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/dynelmjgdqjzwtrpxttx/sql)

-- Step 1: Check if table exists and its structure
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'debate_topics' 
ORDER BY ordinal_position;

-- Step 2: Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.debate_topics (
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

-- Step 3: Add missing columns if table exists but columns are missing
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'debate_topics' AND column_name = 'category'
    ) THEN
        ALTER TABLE public.debate_topics ADD COLUMN category TEXT NOT NULL DEFAULT 'general';
    END IF;
    
    -- Add other columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'debate_topics' AND column_name = 'description'
    ) THEN
        ALTER TABLE public.debate_topics ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'debate_topics' AND column_name = 'theme'
    ) THEN
        ALTER TABLE public.debate_topics ADD COLUMN theme TEXT;
    END IF;
END $$;

-- Step 4: Enable RLS
ALTER TABLE public.debate_topics ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view active debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can create debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can update their own debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Allow anonymous topic creation" ON public.debate_topics;
DROP POLICY IF EXISTS "Allow anonymous topic viewing" ON public.debate_topics;

-- Step 6: Create new RLS policies that work for both authenticated and anonymous users
CREATE POLICY "Allow anonymous topic viewing" ON public.debate_topics
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Allow anonymous topic creation" ON public.debate_topics
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own topics" ON public.debate_topics
  FOR UPDATE TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = reviewed_by);

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_debate_topics_category ON public.debate_topics(category);
CREATE INDEX IF NOT EXISTS idx_debate_topics_status ON public.debate_topics(status);
CREATE INDEX IF NOT EXISTS idx_debate_topics_student_id ON public.debate_topics(student_id);

-- Step 8: Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 9: Create the trigger
DROP TRIGGER IF EXISTS update_debate_topics_updated_at ON public.debate_topics;
CREATE TRIGGER update_debate_topics_updated_at
    BEFORE UPDATE ON public.debate_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Insert some sample data to test
INSERT INTO public.debate_topics (topic_name, category, description, theme, status) 
VALUES 
    ('Should AI replace human teachers?', 'Education', 'Debate about the role of artificial intelligence in education', 'Technology in Education', 'active'),
    ('Climate change: Individual vs Corporate responsibility', 'Environment', 'Who bears the primary responsibility for addressing climate change?', 'Environmental Policy', 'active'),
    ('Universal Basic Income implementation', 'Economics', 'Should governments implement universal basic income?', 'Social Policy', 'active')
ON CONFLICT (id) DO NOTHING;

-- Step 11: Verify the table structure and data
SELECT 
    'Table Structure:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'debate_topics' 
ORDER BY ordinal_position;

-- Check if data was inserted
SELECT 'Sample Data:' as info, * FROM public.debate_topics LIMIT 5;

-- Step 12: Force schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Success message
SELECT 'Schema fix completed successfully! The debate_topics table should now work properly.' as result;
