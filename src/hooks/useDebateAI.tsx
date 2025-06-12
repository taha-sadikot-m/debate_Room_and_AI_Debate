
import { useState, useCallback } from 'react';
import { MAIN_DEBATE_PROMPT, SCORING_PROMPT, FREUD_EVALUATION_PROMPT, POI_PROMPTS, DebateScores, FreudAnalysis } from '@/data/debatePrompts';

interface UseDebateAIProps {
  topic: string;
  theme: string;
  assignedSide: 'FOR' | 'AGAINST';
}

export const useDebateAI = ({ topic, theme, assignedSide }: UseDebateAIProps) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [debatePhase, setDebatePhase] = useState<'opening' | 'rebuttal' | 'closing'>('opening');
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [userScores, setUserScores] = useState<DebateScores[]>([]);
  const [freudAnalyses, setFreudAnalyses] = useState<FreudAnalysis[]>([]);

  const generateMainPrompt = useCallback(() => {
    return MAIN_DEBATE_PROMPT
      .replace('{{theme}}', theme)
      .replace('{{topic}}', topic)
      .replace('{{side}}', assignedSide);
  }, [topic, theme, assignedSide]);

  const generateAIResponse = useCallback(async (userSpeech: string): Promise<string> => {
    // Simulate AI response generation based on the main debate prompt
    const responses = {
      'FOR': {
        'opening': `I strongly support this position on ${topic}. The evidence clearly shows that this approach brings significant benefits to society. Research indicates positive outcomes when we implement these measures. The logical progression of events supports our stance, and we can see real-world examples where this has worked effectively.`,
        'rebuttal': `While you raise interesting points, I must respectfully disagree. The data actually supports our position more strongly. Your concerns, though valid, can be addressed through proper implementation. The benefits far outweigh the potential risks you've mentioned.`,
        'closing': `In conclusion, the evidence overwhelmingly supports our position on ${topic}. We've demonstrated clear benefits, addressed counterarguments, and shown practical applications. The logical choice is clear - we must move forward with this approach.`
      },
      'AGAINST': {
        'opening': `I must respectfully oppose this position on ${topic}. The evidence suggests significant concerns that cannot be ignored. Historical precedent shows us the potential pitfalls of this approach. We must consider the broader implications and unintended consequences.`,
        'rebuttal': `Your arguments, while passionate, overlook critical issues. The data you cite doesn't account for all variables. We must be cautious about implementing policies without considering all stakeholders and potential negative outcomes.`,
        'closing': `In summary, the risks and concerns surrounding ${topic} are too significant to ignore. We've highlighted critical flaws, demonstrated potential harm, and shown why caution is necessary. The responsible choice is to reconsider this approach.`
      }
    };

    const response = responses[assignedSide][debatePhase];
    setAiResponses(prev => [...prev, response]);
    return response;
  }, [topic, assignedSide, debatePhase]);

  const scoreUserSpeech = useCallback(async (userSpeech: string): Promise<DebateScores> => {
    // Simulate scoring based on speech analysis
    const baseScore = Math.floor(Math.random() * 3) + 7; // 7-10 range
    const scores: DebateScores = {
      confidence: Math.min(10, baseScore + Math.floor(Math.random() * 2)),
      clarity: Math.min(10, baseScore + Math.floor(Math.random() * 2)),
      logic: Math.min(10, baseScore + Math.floor(Math.random() * 2)),
      relevance: Math.min(10, baseScore + Math.floor(Math.random() * 2)),
      emotionalImpact: Math.min(10, baseScore + Math.floor(Math.random() * 2)),
      feedback: `Strong delivery with good structure. Consider strengthening your evidence and addressing counterarguments more directly.`
    };

    setUserScores(prev => [...prev, scores]);
    return scores;
  }, []);

  const analyzeFreudian = useCallback(async (userSpeech: string): Promise<FreudAnalysis> => {
    // Simulate Freudian analysis
    const analysis: FreudAnalysis = {
      id: Math.floor(Math.random() * 3) + 6, // 6-8 range
      ego: Math.floor(Math.random() * 3) + 7, // 7-9 range  
      superego: Math.floor(Math.random() * 3) + 6, // 6-8 range
      breakdown: `Your argument shows balanced rational thinking (ego) with some emotional drive (id). Consider incorporating more ethical considerations (superego) to strengthen your position.`,
      tip: `Try to balance your passionate delivery with more structured logical reasoning to create a more compelling argument.`
    };

    setFreudAnalyses(prev => [...prev, analysis]);
    return analysis;
  }, []);

  const generatePOI = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * POI_PROMPTS.length);
    return POI_PROMPTS[randomIndex];
  }, []);

  const advanceDebatePhase = useCallback(() => {
    if (debatePhase === 'opening') {
      setDebatePhase('rebuttal');
    } else if (debatePhase === 'rebuttal') {
      setDebatePhase('closing');
    } else {
      setCurrentRound(prev => prev + 1);
      setDebatePhase('opening');
    }
  }, [debatePhase]);

  return {
    currentRound,
    debatePhase,
    aiResponses,
    userScores,
    freudAnalyses,
    generateMainPrompt,
    generateAIResponse,
    scoreUserSpeech,
    analyzeFreudian,
    generatePOI,
    advanceDebatePhase
  };
};
