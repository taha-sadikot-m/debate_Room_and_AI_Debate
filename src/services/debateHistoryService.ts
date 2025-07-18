import { supabase } from '@/integrations/supabase/client';
import { DebateSession, DebateMessage, DebateEvaluation, DetailedDebateRecord } from '@/types/debate';
import { TopicService } from './topicService';

interface SaveDebateParams {
  topic: string;
  userPosition: 'for' | 'against';
  aiPosition: 'for' | 'against';
  debateType: string;
  messages: Array<{
    speaker: 'user' | 'ai' | 'system';
    text: string;
    timestamp: Date;
  }>;
  durationSeconds?: number;
  evaluation?: {
    overall_score: number;
    breakdown: Record<string, number>;
    strengths: string[];
    improvements: string[];
    argument_analysis: Array<{
      argument: string;
      feedback: string;
      suggestion: string;
    }>;
    final_remarks?: string;
    evaluation_data?: Record<string, any>;
  };
}

export class DebateHistoryService {
  /**
   * Save a complete debate session with messages and evaluation to the database
   */
  static async saveDebateToDatabase(params: SaveDebateParams): Promise<DetailedDebateRecord | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('User not authenticated');
        return null;
      }

      // Prepare session data
      const sessionData: Omit<DebateSession, 'id' | 'created_at'> = {
        user_id: user.user.id,
        topic: params.topic,
        debate_type: params.debateType,
        user_position: params.userPosition,
        ai_position: params.aiPosition,
        duration_seconds: params.durationSeconds || 0,
        status: 'completed',
        session_metadata: {
          saved_at: new Date().toISOString(),
          version: '2.0'
        }
      };

      // Prepare messages data
      const messagesData: Omit<DebateMessage, 'id' | 'session_id' | 'timestamp'>[] = params.messages.map((msg, index) => ({
        speaker: msg.speaker,
        message_text: msg.text,
        message_order: index + 1,
        metadata: {
          original_timestamp: msg.timestamp.toISOString()
        }
      }));

      // Prepare evaluation data if provided
      let evaluationData: Omit<DebateEvaluation, 'id' | 'session_id' | 'created_at'> | undefined;
      if (params.evaluation) {
        evaluationData = {
          user_id: user.user.id,
          overall_score: params.evaluation.overall_score,
          breakdown: params.evaluation.breakdown,
          strengths: params.evaluation.strengths,
          improvements: params.evaluation.improvements,
          argument_analysis: params.evaluation.argument_analysis,
          final_remarks: params.evaluation.final_remarks,
          evaluation_data: params.evaluation.evaluation_data || {}
        };
      }

      // Save to database using TopicService
      const result = await TopicService.saveDetailedDebateSession(
        sessionData,
        messagesData,
        evaluationData
      );

      if (result) {
        console.log('Debate saved successfully:', result);
        return result;
      } else {
        console.error('Failed to save debate to database');
        return null;
      }
    } catch (error) {
      console.error('Error saving debate to database:', error);
      return null;
    }
  }

  /**
   * Save evaluation for an existing debate session
   */
  static async saveEvaluation(
    sessionId: string,
    evaluation: {
      overall_score: number;
      breakdown: Record<string, number>;
      strengths: string[];
      improvements: string[];
      argument_analysis: Array<{
        argument: string;
        feedback: string;
        suggestion: string;
      }>;
      final_remarks?: string;
      evaluation_data?: Record<string, any>;
    }
  ): Promise<DebateEvaluation | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('User not authenticated');
        return null;
      }

      const evaluationData: Omit<DebateEvaluation, 'id' | 'session_id' | 'user_id' | 'created_at'> = {
        overall_score: evaluation.overall_score,
        breakdown: evaluation.breakdown,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        argument_analysis: evaluation.argument_analysis,
        final_remarks: evaluation.final_remarks,
        evaluation_data: evaluation.evaluation_data || {}
      };

      const result = await TopicService.updateDebateEvaluation(sessionId, user.user.id, evaluationData);
      return result;
    } catch (error) {
      console.error('Error saving evaluation:', error);
      return null;
    }
  }

  /**
   * Convert local storage debates to database format (migration helper)
   */
  static async migrateLocalStorageToDatabase(): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('User not authenticated');
        return;
      }

      // Get debates from localStorage
      const localDebates = JSON.parse(localStorage.getItem('instant_debates') || '[]');
      
      if (localDebates.length === 0) {
        console.log('No local debates to migrate');
        return;
      }

      console.log(`Migrating ${localDebates.length} debates from localStorage to database...`);

      for (const debate of localDebates) {
        try {
          // Convert localStorage format to database format
          const saveParams: SaveDebateParams = {
            topic: debate.topic,
            userPosition: debate.userPosition,
            aiPosition: debate.aiPosition,
            debateType: 'instant',
            messages: debate.messages.map((msg: any) => ({
              speaker: msg.speaker,
              text: msg.text,
              timestamp: new Date(msg.timestamp)
            })),
            evaluation: debate.evaluation ? {
              overall_score: debate.evaluation.score,
              breakdown: debate.evaluation.breakdown || {},
              strengths: debate.evaluation.strengths || [],
              improvements: debate.evaluation.improvements || [],
              argument_analysis: debate.evaluation.argument_analysis || [],
              final_remarks: debate.evaluation.final_remarks,
              evaluation_data: debate.evaluation
            } : undefined
          };

          const result = await this.saveDebateToDatabase(saveParams);
          if (result) {
            console.log(`Migrated debate: ${debate.topic}`);
          } else {
            console.error(`Failed to migrate debate: ${debate.topic}`);
          }
        } catch (error) {
          console.error(`Error migrating debate "${debate.topic}":`, error);
        }
      }

      // After successful migration, optionally clear localStorage
      // localStorage.removeItem('instant_debates');
      console.log('Migration completed');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }

  /**
   * Get debate statistics for a user
   */
  static async getDebateStatistics(userId: string): Promise<{
    totalDebates: number;
    averageScore: number;
    highScoreCount: number;
    favorDebates: number;
    againstDebates: number;
    recentDebates: number;
  }> {
    try {
      const debates = await TopicService.getDetailedDebateHistory(userId);
      
      const stats = {
        totalDebates: debates.length,
        averageScore: 0,
        highScoreCount: 0,
        favorDebates: 0,
        againstDebates: 0,
        recentDebates: 0
      };

      if (debates.length === 0) {
        return stats;
      }

      // Calculate statistics
      const evaluatedDebates = debates.filter(d => d.evaluation);
      if (evaluatedDebates.length > 0) {
        const totalScore = evaluatedDebates.reduce((sum, d) => sum + (d.evaluation?.overall_score || 0), 0);
        stats.averageScore = Math.round(totalScore / evaluatedDebates.length);
        stats.highScoreCount = evaluatedDebates.filter(d => (d.evaluation?.overall_score || 0) >= 80).length;
      }

      stats.favorDebates = debates.filter(d => d.session.user_position === 'for').length;
      stats.againstDebates = debates.filter(d => d.session.user_position === 'against').length;

      // Recent debates (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      stats.recentDebates = debates.filter(d => 
        new Date(d.session.created_at || '') > sevenDaysAgo
      ).length;

      return stats;
    } catch (error) {
      console.error('Error getting debate statistics:', error);
      return {
        totalDebates: 0,
        averageScore: 0,
        highScoreCount: 0,
        favorDebates: 0,
        againstDebates: 0,
        recentDebates: 0
      };
    }
  }
}
