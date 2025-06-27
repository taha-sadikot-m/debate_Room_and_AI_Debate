// AI service for debate functionality
class DebateAIService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    // You'll need to set up your AI service endpoint
    this.baseURL = process.env.REACT_APP_AI_SERVICE_URL || '';
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
  }

  async generateDebateResponse(topic: string, position: 'for' | 'against', history: Array<{speaker: string, text: string}>) {
    const prompt = `
      [ROLE] You are a world-class debater arguing the ${position} position.
      [TOPIC] Debate topic: "${topic}"
      [HISTORY] Previous arguments:
      ${this.formatHistory(history.slice(-4))}
      
      [TASK] Craft a compelling response that:
      1. Directly addresses the last point made
      2. Uses logical reasoning and evidence
      3. Includes rhetorical techniques
      4. Maintains a passionate but professional tone
      5. Is 2-3 sentences maximum
      
      [RESPONSE]
    `;

    try {
      const response = await fetch('/api/ai/generate-debate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.8,
          maxTokens: 200
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI response');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error generating debate response:', error);
      return "I'm having trouble responding right now. Please continue with your argument.";
    }
  }

  async evaluatePerformance(transcript: Array<{speaker: string, text: string}>) {
    const userArgs = transcript.filter(msg => msg.speaker === 'user').map(msg => msg.text);
    
    const prompt = `
      [ROLE] You are a professional debate judge analyzing a debate performance.
      [CRITERIA] Evaluate based on:
      - Logical consistency (30%)
      - Evidence quality (25%)
      - Rebuttal effectiveness (20%)
      - Persuasiveness (15%)
      - Rhetorical skill (10%)
      
      [TASK] Provide:
      1. Numerical score (0-100) with breakdown
      2. Three specific strengths
      3. Three actionable improvements
      4. Analysis of 2 key arguments with suggestions
      5. Overall remarks
      
      [DEBATE TRANSCRIPT]
      ${JSON.stringify(userArgs, null, 2)}
      
      [RESPONSE FORMAT]
      Score: [number]/100
      Breakdown: {"logical_consistency": [score], "evidence_quality": [score], "rebuttal_effectiveness": [score], "persuasiveness": [score], "rhetorical_skill": [score]}
      
      Strengths:
      - [strength1]
      - [strength2]
      - [strength3]
      
      Improvements:
      - [improvement1]
      - [improvement2]
      - [improvement3]
      
      Argument Analysis:
      1. Argument: "[excerpt]"
         Feedback: [specific feedback]
         Suggestion: [specific suggestion]
      
      2. Argument: "[excerpt]"
         Feedback: [specific feedback]
         Suggestion: [specific suggestion]
      
      Final Remarks: [overall feedback]
    `;

    try {
      const response = await fetch('/api/ai/evaluate-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.3,
          maxTokens: 600
        })
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate performance');
      }

      const data = await response.json();
      return this.parseEvaluation(data.text);
    } catch (error) {
      console.error('Error evaluating performance:', error);
      return null;
    }
  }

  private formatHistory(history: Array<{speaker: string, text: string}>): string {
    return history.map(msg => `${msg.speaker.toUpperCase()}: ${msg.text}`).join('\n');
  }

  private parseEvaluation(evaluationText: string) {
    // Parse the evaluation text into structured data
    const result = {
      score: 0,
      breakdown: {},
      strengths: [],
      improvements: [],
      argumentAnalysis: [],
      finalRemarks: ''
    };

    try {
      // Extract score
      const scoreMatch = evaluationText.match(/Score: (\d+)\/100/);
      if (scoreMatch) {
        result.score = parseInt(scoreMatch[1]);
      }

      // Extract breakdown JSON
      const breakdownMatch = evaluationText.match(/Breakdown: ({.*?})/);
      if (breakdownMatch) {
        result.breakdown = JSON.parse(breakdownMatch[1]);
      }

      // Extract strengths
      const strengthsSection = evaluationText.match(/Strengths:(.*?)Improvements:/s);
      if (strengthsSection) {
        result.strengths = strengthsSection[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim());
      }

      // Extract improvements
      const improvementsSection = evaluationText.match(/Improvements:(.*?)Argument Analysis:/s);
      if (improvementsSection) {
        result.improvements = improvementsSection[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim());
      }

      // Extract final remarks
      const remarksMatch = evaluationText.match(/Final Remarks: (.*?)$/s);
      if (remarksMatch) {
        result.finalRemarks = remarksMatch[1].trim();
      }

      return result;
    } catch (error) {
      console.error('Error parsing evaluation:', error);
      return result;
    }
  }
}

export const debateAI = new DebateAIService();
