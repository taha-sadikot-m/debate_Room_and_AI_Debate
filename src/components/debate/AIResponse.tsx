
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, Volume2 } from 'lucide-react';
import VoiceSamples from './VoiceSamples';

interface AIResponseProps {
  aiResponse: string;
  onNextRound: () => void;
}

const AIResponse = ({ aiResponse, onNextRound }: AIResponseProps) => {
  const playAIResponse = () => {
    if ('speechSynthesis' in window && aiResponse) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      
      // Try to find an Indian accent voice
      const voices = speechSynthesis.getVoices();
      const indianVoice = voices.find(voice => 
        voice.lang.includes('en-IN') || 
        voice.name.toLowerCase().includes('indian') ||
        voice.name.toLowerCase().includes('ravi') ||
        voice.name.toLowerCase().includes('aditi')
      );
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      } else {
        // Fallback to a British or Australian accent
        const fallbackVoice = voices.find(voice => 
          voice.lang.includes('en-GB') || 
          voice.lang.includes('en-AU')
        );
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      }
      
      // Adjust speech parameters for Indian accent characteristics
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
    }
  };

  if (!aiResponse) return null;

  return (
    <div className="space-y-6">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Opponent Response</span>
            <Button
              variant="outline"
              size="sm"
              onClick={playAIResponse}
              className="ml-auto"
            >
              <Volume2 className="h-4 w-4 mr-1" />
              Listen
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800">{aiResponse}</p>
          </div>
          <div className="mt-4 text-center">
            <Button onClick={onNextRound}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Continue Debate
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Voice Samples Section - shown after AI response */}
      <VoiceSamples />
    </div>
  );
};

export default AIResponse;
