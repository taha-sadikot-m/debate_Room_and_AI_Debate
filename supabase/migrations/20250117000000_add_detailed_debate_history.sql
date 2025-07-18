-- Add detailed debate history support
-- This migration adds tables for storing complete debate conversations and evaluations

-- Create table for storing debate messages/conversations
CREATE TABLE public.debate_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.debate_sessions(id) ON DELETE CASCADE NOT NULL,
  speaker TEXT NOT NULL CHECK (speaker IN ('user', 'ai', 'system')),
  message_text TEXT NOT NULL,
  message_order INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create table for storing debate evaluations
CREATE TABLE public.debate_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.debate_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvements TEXT[] DEFAULT ARRAY[]::TEXT[],
  argument_analysis JSONB DEFAULT '[]'::jsonb,
  final_remarks TEXT,
  evaluation_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add additional columns to debate_sessions for better tracking
ALTER TABLE public.debate_sessions 
ADD COLUMN IF NOT EXISTS user_position TEXT CHECK (user_position IN ('for', 'against')),
ADD COLUMN IF NOT EXISTS ai_position TEXT CHECK (ai_position IN ('for', 'against')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
ADD COLUMN IF NOT EXISTS total_messages INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_messages INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_messages INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_metadata JSONB DEFAULT '{}'::jsonb;

-- Enable RLS
ALTER TABLE public.debate_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for debate_messages
CREATE POLICY "Users can view their own debate messages" 
  ON public.debate_messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.debate_sessions 
    WHERE debate_sessions.id = debate_messages.session_id 
    AND debate_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own debate messages" 
  ON public.debate_messages FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.debate_sessions 
    WHERE debate_sessions.id = debate_messages.session_id 
    AND debate_sessions.user_id = auth.uid()
  ));

-- RLS Policies for debate_evaluations
CREATE POLICY "Users can view their own debate evaluations" 
  ON public.debate_evaluations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debate evaluations" 
  ON public.debate_evaluations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debate evaluations" 
  ON public.debate_evaluations FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_debate_messages_session_id ON public.debate_messages(session_id);
CREATE INDEX idx_debate_messages_timestamp ON public.debate_messages(timestamp);
CREATE INDEX idx_debate_evaluations_session_id ON public.debate_evaluations(session_id);
CREATE INDEX idx_debate_evaluations_user_id ON public.debate_evaluations(user_id);
CREATE INDEX idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX idx_debate_sessions_created_at ON public.debate_sessions(created_at);
