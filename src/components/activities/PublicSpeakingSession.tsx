
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mic, MicOff, Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useAIVoice } from '@/hooks/useAIVoice';
import RealtimeFeedback from '@/components/debate/RealtimeFeedback';

interface PublicSpeakingSessionProps {
  activity: {
    id: string;
    title: string;
    description: string;
    duration: string;
    tokens: string;
    rules: string[];
    aiSampleArgument: string;
  };
  onBack: () => void;
  onComplete: () => void;
}

const PublicSpeakingSession = ({ activity, onBack, onComplete }: PublicSpeakingSessionProps) => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'speaking' | 'completed'>('preparation');
  const [userFeedback, setUserFeedback] = useState({
    fluency: 75,
    clarity: 80,
    confidence: 70,
    relevance: 85
  });

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechToText({ continuous: true });

  const { generateAIVoice, isGenerating } = useAIVoice();

  // Parse duration to get seconds
  const getDurationInSeconds = (duration: string) => {
    const match = duration.match(/(\d+)(?:-(\d+))?\s*minutes?/);
    if (match) {
      return (parseInt(match[1]) + (match[2] ? parseInt(match[2]) : 0)) * 30; // Average and convert to seconds
    }
    return 300; // Default 5 minutes
  };

  useEffect(() => {
    if (sessionStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCurrentPhase('completed');
            stopListening();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionStarted, timeRemaining]);

  // Simulate real-time feedback updates
  useEffect(() => {
    if (isListening && transcript) {
      const interval = setInterval(() => {
        setUserFeedback({
          fluency: Math.min(100, Math.max(50, 70 + Math.random() * 20)),
          clarity: Math.min(100, Math.max(50, 75 + Math.random() * 20)),
          confidence: Math.min(100, Math.max(50, 65 + Math.random() * 25)),
          relevance: Math.min(100, Math.max(50, 80 + Math.random() * 15))
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isListening, transcript]);

  const handleStartSession = () => {
    setSessionStarted(true);
    setTimeRemaining(getDurationInSeconds(activity.duration));
    setCurrentPhase('speaking');
    startListening();
  };

  const handleEndSession = () => {
    setCurrentPhase('completed');
    stopListening();
    setSessionStarted(false);
  };

  const handlePlayAISample = () => {
    generateAIVoice({
      language: 'en',
      text: activity.aiSampleArgument,
      style: 'conversational'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const averageScore = Math.round(
    (userFeedback.fluency + userFeedback.clarity + userFeedback.confidence + userFeedback.relevance) / 4
  );

  if (currentPhase === 'completed') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-green-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
            <span className="text-3xl text-white">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Session Complete!</h1>
          <p className="text-gray-600">Great job on your {activity.title} session</p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Your Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{averageScore}/100</div>
              <Badge className="bg-indigo-100 text-indigo-700">Overall Performance</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-800">{userFeedback.fluency}</div>
                <div className="text-sm text-gray-600">Fluency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-800">{userFeedback.clarity}</div>
                <div className="text-sm text-gray-600">Clarity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-800">{userFeedback.confidence}</div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-800">{userFeedback.relevance}</div>
                <div className="text-sm text-gray-600">Relevance</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🏆 Tokens Earned</h4>
              <p className="text-green-700">{activity.tokens} tokens added to your account!</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={onComplete} className="bg-indigo-600 hover:bg-indigo-700">
            Continue
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back to Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
          <p className="text-gray-600 mt-2">Your Stage. Your Voice. Your Growth.</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {!sessionStarted ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Rules */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Activity Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{activity.description}</p>
              <ul className="space-y-2">
                {activity.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span className="text-sm text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Duration:</span>
                  <Badge variant="outline">{activity.duration}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Potential Tokens:</span>
                  <Badge className="bg-yellow-100 text-yellow-700">{activity.tokens}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Sample */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-purple-600" />
                <span>AI Sample Performance</span>
              </CardTitle>
              <CardDescription>
                Listen to how an AI would approach this activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-800 italic text-sm">
                  "{activity.aiSampleArgument}"
                </p>
              </div>
              
              <Button 
                onClick={handlePlayAISample}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                    Playing Sample...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play AI Sample
                  </>
                )}
              </Button>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleStartSession} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                >
                  Start Your Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recording Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recording Session</span>
                  <div className="text-2xl font-mono text-indigo-600">
                    {formatTime(timeRemaining)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    size="lg"
                    className={`w-24 h-24 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {isListening ? 'Recording... Speak clearly into your microphone' : 'Click to start recording'}
                  </p>
                </div>

                <Progress 
                  value={timeRemaining > 0 ? ((getDurationInSeconds(activity.duration) - timeRemaining) / getDurationInSeconds(activity.duration)) * 100 : 100} 
                  className="h-3" 
                />

                {transcript && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Live Transcription</h4>
                    <p className="text-blue-800 text-sm">{transcript}</p>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={resetTranscript}
                    disabled={!transcript}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleEndSession}
                  >
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Feedback */}
          <div>
            <RealtimeFeedback feedback={userFeedback} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicSpeakingSession;
