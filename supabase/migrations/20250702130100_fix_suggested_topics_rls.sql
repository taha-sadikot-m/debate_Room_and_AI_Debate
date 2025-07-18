-- Fix RLS policies for suggested_topics to allow demo/development usage

-- Drop existing policies 
DROP POLICY IF EXISTS "Users can create topic suggestions" ON public.suggested_topics;

-- Allow both authenticated and anonymous users to suggest topics
CREATE POLICY "Everyone can create topic suggestions" ON public.suggested_topics
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Keep existing view and update policies but make them work for anonymous too
DROP POLICY IF EXISTS "Users can view topic suggestions" ON public.suggested_topics;
CREATE POLICY "Everyone can view topic suggestions" ON public.suggested_topics
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update topic suggestions" ON public.suggested_topics;
CREATE POLICY "Everyone can update topic suggestions" ON public.suggested_topics
  FOR UPDATE TO anon, authenticated
  USING (true);
