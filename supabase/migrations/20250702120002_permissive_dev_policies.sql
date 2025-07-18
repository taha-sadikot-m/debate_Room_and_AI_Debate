-- Create permissive RLS policies for development/demo purposes
-- This allows topic operations without strict authentication requirements

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Authenticated users can create debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can update debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can delete their own debate topics" ON public.debate_topics;

-- Create development-friendly policies

-- Allow anyone to view topics
CREATE POLICY "Allow all to view debate topics" ON public.debate_topics
  FOR SELECT 
  USING (true);

-- Allow anyone to insert topics (for development)
CREATE POLICY "Allow all to create debate topics" ON public.debate_topics
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update topics (for development)
CREATE POLICY "Allow all to update debate topics" ON public.debate_topics
  FOR UPDATE
  USING (true);

-- Allow anyone to delete topics (for development)
CREATE POLICY "Allow all to delete debate topics" ON public.debate_topics
  FOR DELETE
  USING (true);

-- Grant permissions to anon role for development
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_topics TO authenticated;

-- Also update suggested_topics for consistency
DROP POLICY IF EXISTS "Users can create topic suggestions" ON public.suggested_topics;
DROP POLICY IF EXISTS "Users can view topic suggestions" ON public.suggested_topics;
DROP POLICY IF EXISTS "Users can update topic suggestions" ON public.suggested_topics;

CREATE POLICY "Allow all to create topic suggestions" ON public.suggested_topics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all to view topic suggestions" ON public.suggested_topics
  FOR SELECT USING (true);

CREATE POLICY "Allow all to update topic suggestions" ON public.suggested_topics
  FOR UPDATE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggested_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggested_topics TO authenticated;
