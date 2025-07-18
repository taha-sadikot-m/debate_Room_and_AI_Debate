-- Create debate_topics table for storing curated debate topics
CREATE TABLE public.debate_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  student_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Add Row Level Security
ALTER TABLE public.debate_topics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view active topics
CREATE POLICY "Users can view active debate topics" ON public.debate_topics
  FOR SELECT TO authenticated
  USING (status = 'active');

-- Allow authenticated users to insert topics
CREATE POLICY "Users can create debate topics" ON public.debate_topics
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Allow users to update their own topics
CREATE POLICY "Users can update their own debate topics" ON public.debate_topics
  FOR UPDATE TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = reviewed_by);

-- Create indexes for better performance
CREATE INDEX idx_debate_topics_category ON public.debate_topics(category);
CREATE INDEX idx_debate_topics_status ON public.debate_topics(status);
CREATE INDEX idx_debate_topics_student_id ON public.debate_topics(student_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_debate_topics_updated_at
    BEFORE UPDATE ON public.debate_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
