import { supabase } from '@/integrations/supabase/client';
import { 
  DebateTopic, 
  SuggestedTopic, 
  DebateSession, 
  DebateMessage,
  DebateEvaluation,
  DetailedDebateRecord,
  DEFAULT_TOPICS, 
  TOPIC_CATEGORIES 
} from '@/types/debate';

export class TopicService {
  // Get all debate topics from database
  static async getDebateTopics(category?: string): Promise<DebateTopic[]> {
    try {
      let query = supabase
        .from('debate_topics')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching debate topics:', error);
        // Return default topics as fallback
        return this.getDefaultTopicsAsDebateTopics(category);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDebateTopics:', error);
      return this.getDefaultTopicsAsDebateTopics(category);
    }
  }

  // Get default topics formatted as DebateTopic objects
  static getDefaultTopicsAsDebateTopics(category?: string): DebateTopic[] {
    const topics: DebateTopic[] = [];
    
    if (category && DEFAULT_TOPICS[category]) {
      return DEFAULT_TOPICS[category].map((topic, index) => ({
        id: `default-${category}-${index}`,
        topic_name: topic,
        category: category,
        status: 'active' as const,
        description: `A ${category} debate topic`
      }));
    }

    // Return all default topics if no category specified
    Object.entries(DEFAULT_TOPICS).forEach(([cat, topicList]) => {
      topicList.forEach((topic, index) => {
        topics.push({
          id: `default-${cat}-${index}`,
          topic_name: topic,
          category: cat,
          status: 'active' as const,
          description: `A ${cat} debate topic`
        });
      });
    });

    return topics;
  }

  // Add a new debate topic
  static async addDebateTopic(topic: Omit<DebateTopic, 'id' | 'created_at' | 'updated_at'>): Promise<DebateTopic | null> {
    try {
      // Get the current user, but don't fail if not authenticated
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      // Prepare the topic data
      const topicData = {
        ...topic,
        student_id: authData?.user?.id || null, // Allow null for demo/development
        status: 'active'
      };

      console.log('Adding topic with data:', topicData);

      const { data, error } = await supabase
        .from('debate_topics')
        .insert(topicData)
        .select()
        .single();

      if (error) {
        console.error('Error adding debate topic:', error);
        // If RLS error, provide helpful feedback
        if (error.code === '42501') {
          console.error('RLS Error: This is likely due to Row Level Security policies. The topic creation was blocked.');
          console.error('Solution: Update RLS policies to allow anonymous or authenticated users to create topics.');
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in addDebateTopic:', error);
      return null;
    }
  }

  // Suggest a new topic (user-submitted)
  static async suggestTopic(topic: Omit<SuggestedTopic, 'id' | 'created_at' | 'user_id'>): Promise<SuggestedTopic | null> {
    try {
      // Get the current user, but don't fail if not authenticated
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      // Prepare the suggestion data
      const suggestionData = {
        ...topic,
        user_id: authData?.user?.id || null, // Allow null for demo/development
        status: 'pending'
      };

      console.log('Adding topic suggestion with data:', suggestionData);

      const { data, error } = await supabase
        .from('suggested_topics')
        .insert(suggestionData)
        .select()
        .single();

      if (error) {
        console.error('Error suggesting topic:', error);
        // If RLS error, provide helpful feedback
        if (error.code === '42501') {
          console.error('RLS Error: This is likely due to Row Level Security policies. The topic suggestion was blocked.');
          console.error('Solution: Update RLS policies to allow anonymous or authenticated users to suggest topics.');
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in suggestTopic:', error);
      return null;
    }
  }

  // Get suggested topics
  static async getSuggestedTopics(): Promise<SuggestedTopic[]> {
    try {
      const { data, error } = await supabase
        .from('suggested_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suggested topics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuggestedTopics:', error);
      return [];
    }
  }

  // Save debate session
  static async saveDebateSession(session: Omit<DebateSession, 'id' | 'created_at'>): Promise<DebateSession | null> {
    try {
      const { data, error } = await supabase
        .from('debate_sessions')
        .insert(session)
        .select()
        .single();

      if (error) {
        console.error('Error saving debate session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in saveDebateSession:', error);
      return null;
    }
  }

  // Save detailed debate session with messages
  static async saveDetailedDebateSession(
    session: Omit<DebateSession, 'id' | 'created_at'>,
    messages: Omit<DebateMessage, 'id' | 'session_id' | 'timestamp'>[],
    evaluation?: Omit<DebateEvaluation, 'id' | 'session_id' | 'created_at'>
  ): Promise<DetailedDebateRecord | null> {
    try {
      // First save the session
      const { data: sessionData, error: sessionError } = await supabase
        .from('debate_sessions')
        .insert({
          ...session,
          total_messages: messages.length,
          user_messages: messages.filter(m => m.speaker === 'user').length,
          ai_messages: messages.filter(m => m.speaker === 'ai').length,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error saving debate session:', sessionError);
        return null;
      }

      // Save messages
      const messagesWithSessionId = messages.map((msg, index) => ({
        ...msg,
        session_id: sessionData.id,
        message_order: index + 1,
      }));

      const { data: messagesData, error: messagesError } = await supabase
        .from('debate_messages')
        .insert(messagesWithSessionId)
        .select();

      if (messagesError) {
        console.error('Error saving debate messages:', messagesError);
        return null;
      }

      // Save evaluation if provided
      let evaluationData = null;
      if (evaluation) {
        const { data: evalData, error: evalError } = await supabase
          .from('debate_evaluations')
          .insert({
            ...evaluation,
            session_id: sessionData.id,
          })
          .select()
          .single();

        if (evalError) {
          console.error('Error saving debate evaluation:', evalError);
        } else {
          evaluationData = evalData;
        }
      }

      return {
        session: sessionData,
        messages: messagesData || [],
        evaluation: evaluationData,
      };
    } catch (error) {
      console.error('Error in saveDetailedDebateSession:', error);
      return null;
    }
  }

  // Get user's debate history
  static async getUserDebateHistory(userId: string): Promise<DebateSession[]> {
    try {
      const { data, error } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching debate history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserDebateHistory:', error);
      return [];
    }
  }

  // Get detailed debate history for a user
  static async getDetailedDebateHistory(userId: string, limit: number = 50): Promise<DetailedDebateRecord[]> {
    try {
      // Get sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (sessionsError) {
        console.error('Error fetching debate sessions:', sessionsError);
        return [];
      }

      if (!sessions || sessions.length === 0) {
        return [];
      }

      // Get messages for all sessions
      const sessionIds = sessions.map(s => s.id);
      const { data: messages, error: messagesError } = await supabase
        .from('debate_messages')
        .select('*')
        .in('session_id', sessionIds)
        .order('message_order', { ascending: true });

      if (messagesError) {
        console.error('Error fetching debate messages:', messagesError);
      }

      // Get evaluations for all sessions
      const { data: evaluations, error: evaluationsError } = await supabase
        .from('debate_evaluations')
        .select('*')
        .in('session_id', sessionIds);

      if (evaluationsError) {
        console.error('Error fetching debate evaluations:', evaluationsError);
      }

      // Combine data
      const debateRecords: DetailedDebateRecord[] = sessions.map(session => {
        const sessionMessages = messages?.filter(m => m.session_id === session.id) || [];
        const sessionEvaluation = evaluations?.find(e => e.session_id === session.id);

        return {
          session,
          messages: sessionMessages,
          evaluation: sessionEvaluation,
        };
      });

      return debateRecords;
    } catch (error) {
      console.error('Error in getDetailedDebateHistory:', error);
      return [];
    }
  }

  // Get a single detailed debate record
  static async getDetailedDebateRecord(sessionId: string, userId: string): Promise<DetailedDebateRecord | null> {
    try {
      // Get session
      const { data: session, error: sessionError } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionError) {
        console.error('Error fetching debate session:', sessionError);
        return null;
      }

      // Get messages
      const { data: messages, error: messagesError } = await supabase
        .from('debate_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('message_order', { ascending: true });

      if (messagesError) {
        console.error('Error fetching debate messages:', messagesError);
      }

      // Get evaluation
      const { data: evaluation, error: evaluationError } = await supabase
        .from('debate_evaluations')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (evaluationError && evaluationError.code !== 'PGRST116') {
        console.error('Error fetching debate evaluation:', evaluationError);
      }

      return {
        session,
        messages: messages || [],
        evaluation: evaluation || undefined,
      };
    } catch (error) {
      console.error('Error in getDetailedDebateRecord:', error);
      return null;
    }
  }

  // Update debate evaluation
  static async updateDebateEvaluation(
    sessionId: string, 
    userId: string, 
    evaluation: Omit<DebateEvaluation, 'id' | 'session_id' | 'user_id' | 'created_at'>
  ): Promise<DebateEvaluation | null> {
    try {
      const { data, error } = await supabase
        .from('debate_evaluations')
        .upsert({
          ...evaluation,
          session_id: sessionId,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating debate evaluation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateDebateEvaluation:', error);
      return null;
    }
  }

  // Delete debate session and all related data
  static async deleteDebateSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('debate_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting debate session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteDebateSession:', error);
      return false;
    }
  }

  // Search topics by keyword
  static async searchTopics(keyword: string, category?: string): Promise<DebateTopic[]> {
    try {
      let query = supabase
        .from('debate_topics')
        .select('*')
        .eq('status', 'active')
        .ilike('topic_name', `%${keyword}%`);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching topics:', error);
        // Fallback to searching default topics
        return this.searchDefaultTopics(keyword, category);
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchTopics:', error);
      return this.searchDefaultTopics(keyword, category);
    }
  }

  // Search default topics by keyword
  static searchDefaultTopics(keyword: string, category?: string): DebateTopic[] {
    const allTopics = this.getDefaultTopicsAsDebateTopics(category);
    return allTopics.filter(topic => 
      topic.topic_name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Get topic categories
  static getTopicCategories() {
    return TOPIC_CATEGORIES;
  }

  // Initialize default topics in database (admin function)
  static async initializeDefaultTopics(): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.error('User not authenticated');
        return;
      }

      for (const [category, topics] of Object.entries(DEFAULT_TOPICS)) {
        for (const topic of topics) {
          await this.addDebateTopic({
            topic_name: topic,
            category,
            description: `Default ${category} topic`,
            status: 'active'
          });
        }
      }
    } catch (error) {
      console.error('Error initializing default topics:', error);
    }
  }
}
