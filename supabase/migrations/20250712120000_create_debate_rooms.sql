CREATE TABLE debate_rooms (
  id VARCHAR PRIMARY KEY,
  creator_id VARCHAR NOT NULL,
  topic VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  format VARCHAR DEFAULT '1v1',
  language VARCHAR DEFAULT 'en'
);

-- Add RLS policies
ALTER TABLE debate_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read debate rooms" ON debate_rooms
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create debate rooms" ON debate_rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own debate rooms" ON debate_rooms
  FOR UPDATE USING (creator_id = auth.uid());
