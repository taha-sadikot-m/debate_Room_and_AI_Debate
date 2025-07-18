-- Migration: Add human debate room history tables
-- Date: 2025-01-17
-- Purpose: Store human debate room data, participants, and messages for detailed history tracking

-- Create human_debate_rooms table
CREATE TABLE IF NOT EXISTS public.human_debate_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(6) NOT NULL UNIQUE, -- 6-character room code
    topic TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
    room_type VARCHAR(20) DEFAULT 'private' CHECK (room_type IN ('public', 'private')),
    max_participants INTEGER DEFAULT 10,
    host_name TEXT NOT NULL,
    winner VARCHAR(20) CHECK (winner IN ('FOR', 'AGAINST', 'DRAW')),
    moderator_notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Allow NULL for created_by to support guest users
    CONSTRAINT valid_created_by CHECK (created_by IS NULL OR created_by IS NOT NULL)
);

-- Create human_debate_participants table
CREATE TABLE IF NOT EXISTS public.human_debate_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.human_debate_rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Can be temporary user ID for non-authenticated users
    user_name TEXT NOT NULL,
    side VARCHAR(20) CHECK (side IN ('FOR', 'AGAINST', 'OBSERVER', 'EVALUATOR')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    participant_metadata JSONB DEFAULT '{}',
    
    UNIQUE(room_id, user_id)
);

-- Create human_debate_messages table
CREATE TABLE IF NOT EXISTS public.human_debate_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.human_debate_rooms(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL, -- Matches user_id from participants
    sender_name TEXT NOT NULL,
    message_text TEXT NOT NULL,
    side VARCHAR(20) NOT NULL CHECK (side IN ('FOR', 'AGAINST', 'OBSERVER', 'EVALUATOR')),
    message_order SERIAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_metadata JSONB DEFAULT '{}'
);

-- Create human_debate_tags table for categorizing debates
CREATE TABLE IF NOT EXISTS public.human_debate_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.human_debate_rooms(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(room_id, tag_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_human_debate_rooms_created_by ON public.human_debate_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_human_debate_rooms_status ON public.human_debate_rooms(status);
CREATE INDEX IF NOT EXISTS idx_human_debate_rooms_created_at ON public.human_debate_rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_human_debate_rooms_room_id ON public.human_debate_rooms(room_id);

CREATE INDEX IF NOT EXISTS idx_human_debate_participants_room_id ON public.human_debate_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_human_debate_participants_user_id ON public.human_debate_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_human_debate_participants_side ON public.human_debate_participants(side);

CREATE INDEX IF NOT EXISTS idx_human_debate_messages_room_id ON public.human_debate_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_human_debate_messages_created_at ON public.human_debate_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_human_debate_messages_sender_id ON public.human_debate_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_human_debate_messages_order ON public.human_debate_messages(room_id, message_order);

CREATE INDEX IF NOT EXISTS idx_human_debate_tags_room_id ON public.human_debate_tags(room_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.human_debate_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_debate_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_debate_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_debate_tags ENABLE ROW LEVEL SECURITY;

-- Policies for human_debate_rooms (accessible to all including guests)
CREATE POLICY "Anyone can view debate rooms" ON public.human_debate_rooms
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create debate rooms" ON public.human_debate_rooms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own debate rooms or guest rooms" ON public.human_debate_rooms
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        created_by IS NULL OR
        auth.uid() IS NULL
    );

-- Policies for human_debate_participants (accessible to all including guests)
CREATE POLICY "Anyone can view participants" ON public.human_debate_participants
    FOR SELECT USING (true);

CREATE POLICY "Anyone can join debates as participants" ON public.human_debate_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update participation" ON public.human_debate_participants
    FOR UPDATE USING (true);

-- Policies for human_debate_messages (accessible to all including guests)
CREATE POLICY "Anyone can view messages" ON public.human_debate_messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages" ON public.human_debate_messages
    FOR INSERT WITH CHECK (true);

-- Policies for human_debate_tags (accessible to all including guests)
CREATE POLICY "Anyone can view tags" ON public.human_debate_tags
    FOR SELECT USING (true);

CREATE POLICY "Anyone can manage tags" ON public.human_debate_tags
    FOR ALL USING (true);

-- Create helpful views for easier querying
CREATE OR REPLACE VIEW public.human_debate_room_summary AS
SELECT 
    r.id,
    r.room_id,
    r.topic,
    r.created_by,
    r.created_at,
    r.ended_at,
    r.status,
    r.room_type,
    r.host_name,
    r.winner,
    CASE 
        WHEN r.ended_at IS NOT NULL THEN r.ended_at - r.created_at
        ELSE NOW() - r.created_at
    END AS duration,
    COUNT(DISTINCT p.id) AS participant_count,
    COUNT(DISTINCT m.id) AS message_count,
    COUNT(CASE WHEN p.side = 'FOR' THEN 1 END) AS for_participants,
    COUNT(CASE WHEN p.side = 'AGAINST' THEN 1 END) AS against_participants,
    COUNT(CASE WHEN p.side = 'OBSERVER' THEN 1 END) AS observer_participants,
    COUNT(CASE WHEN p.side = 'EVALUATOR' THEN 1 END) AS evaluator_participants,
    COUNT(CASE WHEN m.side = 'FOR' THEN 1 END) AS for_messages,
    COUNT(CASE WHEN m.side = 'AGAINST' THEN 1 END) AS against_messages,
    ARRAY_AGG(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL) AS tags
FROM public.human_debate_rooms r
LEFT JOIN public.human_debate_participants p ON r.id = p.room_id
LEFT JOIN public.human_debate_messages m ON r.id = m.room_id
LEFT JOIN public.human_debate_tags t ON r.id = t.room_id
GROUP BY r.id, r.room_id, r.topic, r.created_by, r.created_at, r.ended_at, 
         r.status, r.room_type, r.host_name, r.winner;

-- Create function to get human debate history
CREATE OR REPLACE FUNCTION public.get_user_human_debate_history(user_identifier TEXT DEFAULT NULL)
RETURNS TABLE (
    room_data JSONB,
    participants JSONB,
    messages JSONB,
    tags TEXT[]
) AS $$
DECLARE
    uid_to_search TEXT;
BEGIN
    -- Use provided user_identifier or fall back to current auth user
    uid_to_search := COALESCE(
        user_identifier, 
        auth.uid()::text
    );
    
    RETURN QUERY
    SELECT 
        to_jsonb(r.*) AS room_data,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'user_name', p.user_name,
                    'side', p.side,
                    'joined_at', p.joined_at,
                    'left_at', p.left_at,
                    'is_active', p.is_active,
                    'last_seen', p.last_seen
                )
            ) FILTER (WHERE p.id IS NOT NULL),
            '[]'::jsonb
        ) AS participants,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', m.id,
                    'sender_id', m.sender_id,
                    'sender_name', m.sender_name,
                    'message_text', m.message_text,
                    'side', m.side,
                    'message_order', m.message_order,
                    'created_at', m.created_at
                ) ORDER BY m.message_order
            ) FILTER (WHERE m.id IS NOT NULL),
            '[]'::jsonb
        ) AS messages,
        ARRAY_AGG(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL) AS tags
    FROM public.human_debate_rooms r
    LEFT JOIN public.human_debate_participants p ON r.id = p.room_id
    LEFT JOIN public.human_debate_messages m ON r.id = m.room_id
    LEFT JOIN public.human_debate_tags t ON r.id = t.room_id
    WHERE 
        (uid_to_search IS NOT NULL AND (
            r.created_by::text = uid_to_search OR 
            r.id IN (
                SELECT room_id FROM public.human_debate_participants 
                WHERE user_id = uid_to_search
            )
        )) OR
        (uid_to_search IS NULL) -- Show all for guest users
    GROUP BY r.id
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to save a complete human debate session
CREATE OR REPLACE FUNCTION public.save_human_debate_session(
    p_room_id TEXT,
    p_topic TEXT,
    p_created_by UUID,
    p_host_name TEXT,
    p_participants JSONB,
    p_messages JSONB,
    p_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_status TEXT DEFAULT 'completed',
    p_winner TEXT DEFAULT NULL,
    p_moderator_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    debate_room_uuid UUID;
    participant JSONB;
    message JSONB;
    tag_name TEXT;
    message_counter INTEGER := 1;
BEGIN
    -- Insert or update the debate room
    INSERT INTO public.human_debate_rooms (
        room_id, topic, created_by, host_name, status, winner, moderator_notes, ended_at
    ) VALUES (
        p_room_id, p_topic, p_created_by, p_host_name, p_status, p_winner, p_moderator_notes,
        CASE WHEN p_status = 'completed' THEN NOW() ELSE NULL END
    )
    ON CONFLICT (room_id) DO UPDATE SET
        status = p_status,
        winner = p_winner,
        moderator_notes = p_moderator_notes,
        ended_at = CASE WHEN p_status = 'completed' THEN NOW() ELSE public.human_debate_rooms.ended_at END
    RETURNING id INTO debate_room_uuid;

    -- Clear existing participants and messages (for updates)
    DELETE FROM public.human_debate_participants WHERE room_id = debate_room_uuid;
    DELETE FROM public.human_debate_messages WHERE room_id = debate_room_uuid;
    DELETE FROM public.human_debate_tags WHERE room_id = debate_room_uuid;

    -- Insert participants
    FOR participant IN SELECT * FROM jsonb_array_elements(p_participants)
    LOOP
        INSERT INTO public.human_debate_participants (
            room_id, user_id, user_name, side, joined_at, left_at, is_active, last_seen
        ) VALUES (
            debate_room_uuid,
            participant->>'user_id',
            participant->>'user_name',
            participant->>'side',
            COALESCE((participant->>'joined_at')::timestamp with time zone, NOW()),
            (participant->>'left_at')::timestamp with time zone,
            COALESCE((participant->>'is_active')::boolean, true),
            COALESCE((participant->>'last_seen')::timestamp with time zone, NOW())
        );
    END LOOP;

    -- Insert messages with proper ordering
    FOR message IN SELECT * FROM jsonb_array_elements(p_messages)
    LOOP
        INSERT INTO public.human_debate_messages (
            room_id, sender_id, sender_name, message_text, side, created_at, message_order
        ) VALUES (
            debate_room_uuid,
            message->>'sender_id',
            message->>'sender_name',
            message->>'message_text',
            message->>'side',
            COALESCE((message->>'created_at')::timestamp with time zone, NOW()),
            message_counter
        );
        message_counter := message_counter + 1;
    END LOOP;

    -- Insert tags
    FOREACH tag_name IN ARRAY p_tags
    LOOP
        INSERT INTO public.human_debate_tags (room_id, tag_name)
        VALUES (debate_room_uuid, tag_name);
    END LOOP;

    RETURN debate_room_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.human_debate_rooms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.human_debate_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.human_debate_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.human_debate_tags TO authenticated;

GRANT SELECT ON public.human_debate_room_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_human_debate_history(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_human_debate_session(TEXT, TEXT, UUID, TEXT, JSONB, JSONB, TEXT[], TEXT, TEXT, TEXT) TO authenticated;

-- Also grant to anon for guest users
GRANT SELECT, INSERT, UPDATE ON public.human_debate_rooms TO anon;
GRANT SELECT, INSERT, UPDATE ON public.human_debate_participants TO anon;
GRANT SELECT, INSERT, UPDATE ON public.human_debate_messages TO anon;
GRANT SELECT, INSERT, UPDATE ON public.human_debate_tags TO anon;

GRANT SELECT ON public.human_debate_room_summary TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_human_debate_history(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.save_human_debate_session(TEXT, TEXT, UUID, TEXT, JSONB, JSONB, TEXT[], TEXT, TEXT, TEXT) TO anon;
