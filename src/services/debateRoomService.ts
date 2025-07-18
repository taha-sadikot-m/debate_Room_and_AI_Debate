import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface DebateRoom {
  id: string;
  creator_id: string;
  topic: string;
  created_at: Date;
  is_active: boolean;
  format: string;
  language: string;
}

export interface DebateMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  content: string;
  position: 'FOR' | 'AGAINST';
  created_at: Date;
}

export interface DebateParticipant {
  id: string;
  name: string;
  position: 'FOR' | 'AGAINST' | null;
  is_speaking: boolean;
}

export const createDebateRoom = async (
  topic: string,
  creator_id: string = 'anonymous',
  format: '1v1' | '3v3' = '1v1',
  language: string = 'en'
): Promise<string> => {
  // Generate a 6-character alphanumeric room ID
  const roomId = generateRoomId();
  
  try {
    const { data, error } = await supabase
      .from('debate_rooms')
      .insert({
        id: roomId,
        creator_id: creator_id,
        topic: topic,
        format: format,
        language: language
      })
      .select();
    
    if (error) {
      console.error('Error creating debate room:', error);
      throw error;
    }
    
    return roomId;
  } catch (err) {
    console.error('Failed to create debate room:', err);
    throw err;
  }
};

export const getDebateRoom = async (roomId: string): Promise<DebateRoom | null> => {
  try {
    const { data, error } = await supabase
      .from('debate_rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (error) {
      console.error('Error fetching debate room:', error);
      return null;
    }
    
    return data as unknown as DebateRoom;
  } catch (err) {
    console.error('Failed to fetch debate room:', err);
    return null;
  }
};

export const joinDebateRoom = (
  roomId: string,
  userId: string,
  userName: string,
  position: 'FOR' | 'AGAINST' | null = null
) => {
  const channel = supabase.channel(`debate-room-${roomId}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  // Track user presence
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        id: userId,
        name: userName,
        position,
        is_speaking: false,
        timestamp: new Date(),
      });
    }
  });

  return channel;
};

export const sendDebateMessage = async (
  channel: any,
  message: {
    roomId: string,
    userId: string,
    userName: string,
    content: string,
    position: 'FOR' | 'AGAINST'
  }
) => {
  await channel.send({
    type: 'broadcast',
    event: 'debate-message',
    payload: {
      id: uuidv4(),
      ...message,
      timestamp: new Date(),
    },
  });
};

// Generate a random 6-character room ID
export const generateRoomId = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
