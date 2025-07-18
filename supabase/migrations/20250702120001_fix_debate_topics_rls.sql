-- Update RLS policies for debate_topics table to be more permissive
-- This fixes the "new row violates row-level security policy" error

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view active debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can create debate topics" ON public.debate_topics;
DROP POLICY IF EXISTS "Users can update their own debate topics" ON public.debate_topics;

-- Create more permissive policies

-- Allow authenticated users to view all topics (not just active ones)
CREATE POLICY "Authenticated users can view all debate topics" ON public.debate_topics
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to insert topics with proper student_id
CREATE POLICY "Authenticated users can create debate topics" ON public.debate_topics
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (student_id = auth.uid() OR student_id IS NULL)
  );

-- Allow users to update their own topics or topics without an owner
CREATE POLICY "Users can update debate topics" ON public.debate_topics
  FOR UPDATE TO authenticated
  USING (
    auth.uid() IS NOT NULL AND 
    (student_id = auth.uid() OR student_id IS NULL OR reviewed_by = auth.uid())
  );

-- Allow users to delete their own topics
CREATE POLICY "Users can delete their own debate topics" ON public.debate_topics
  FOR DELETE TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = reviewed_by);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_topics TO authenticated;
