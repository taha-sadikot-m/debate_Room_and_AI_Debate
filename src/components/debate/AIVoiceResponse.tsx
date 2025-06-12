
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { useAIVoice } from '@/hooks/useAIVoice';

interface AIVoiceResponseProps {
  aiResponse: string;
  language: string;
  onNextRound: () => void;
}

const AIVoiceResponse = ({ aiResponse, language, onNextRound }: AIVoiceResponseProps) => {
  const { generateAIVoice, stopAIVoice, isGenerating } = useAIVoice();

  const handlePlayVoice = () => {
    if (isGenerating) {
      stopAIVoice();
    } else {
      generateAIVoice({
        language,
        text: aiResponse,
        style: 'parliamentary'
      });
    }
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'hi': 'हिन्दी',
      'ta': 'தமிழ்',
      'fr': 'Français',
      'es': 'Español',
      'de': 'Deutsch'
    };
    return languages[code] || 'English';
  };

  if (!aiResponse) return null;

  return (
    <div className="space-y-6">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Opponent Response</span>
              <span className="text-sm text-gray-500">({getLanguageName(language)})</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayVoice}
              disabled={!aiResponse}
              className={isGenerating ? "bg-red-50 border-red-300" : ""}
            >
              {isGenerating ? (
                <>
                  <VolumeX className="h-4 w-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-1" />
                  Listen
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800">{aiResponse}</p>
          </div>
          
          {/* Voice Status Indicator */}
          {isGenerating && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
              <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>AI is speaking...</span>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button onClick={onNextRound}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Continue Debate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVoiceResponse;
