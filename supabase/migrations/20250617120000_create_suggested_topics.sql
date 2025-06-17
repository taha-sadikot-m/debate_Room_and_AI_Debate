
-- Create suggested_topics table for student topic suggestions
CREATE TABLE public.suggested_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT,
  topic_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.suggested_topics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own suggestions
CREATE POLICY "Users can create topic suggestions" ON public.suggested_topics
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to view all suggestions (for teachers)
CREATE POLICY "Users can view topic suggestions" ON public.suggested_topics
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update suggestions (for teachers to review)
CREATE POLICY "Users can update topic suggestions" ON public.suggested_topics
  FOR UPDATE TO authenticated
  USING (true);
