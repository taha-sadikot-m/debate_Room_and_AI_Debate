-- Fix RLS policies for debate_topics to allow demo/development usage

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can update their own debate topics" ON public.debate_topics;

-- Allow authenticated users to create topics (with or without student_id)
CREATE POLICY "Authenticated users can create debate topics" ON public.debate_topics
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow users to create topics even when not authenticated (for demo purposes)
CREATE POLICY "Anonymous users can create topics for demo" ON public.debate_topics
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow users to update their own topics OR admin updates
CREATE POLICY "Users can update their own debate topics" ON public.debate_topics
  FOR UPDATE TO authenticated
  USING (auth.uid() = student_id OR student_id IS NULL);

-- Allow anonymous updates for demo purposes
CREATE POLICY "Anonymous users can update topics for demo" ON public.debate_topics
  FOR UPDATE TO anon
  USING (true);

-- Allow everyone to view active topics (both authenticated and anonymous)
DROP POLICY IF EXISTS "Users can view active debate topics" ON public.debate_topics;
CREATE POLICY "Everyone can view active debate topics" ON public.debate_topics
  FOR SELECT TO anon, authenticated
  USING (status = 'active');
