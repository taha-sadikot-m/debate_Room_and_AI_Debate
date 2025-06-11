
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';

interface SpeechInputProps {
  isRecording: boolean;
  currentSpeaker: 'student' | 'opponent';
  speechText: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const SpeechInput = ({ 
  isRecording, 
  currentSpeaker, 
  speechText, 
  onStartRecording, 
  onStopRecording 
}: SpeechInputProps) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>Your Speech</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            size="lg"
            className={`w-24 h-24 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'gradient-indigo'}`}
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={currentSpeaker !== 'student'}
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            {isRecording ? 'Recording... Click to stop' : currentSpeaker === 'student' ? 'Click to start recording' : 'Waiting for opponent...'}
          </p>
        </div>

        {speechText && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Your Speech (Transcribed)</h4>
            <p className="text-blue-800">{speechText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechInput;
