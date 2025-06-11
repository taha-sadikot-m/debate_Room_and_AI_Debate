
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw,
  MessageSquare,
  Brain,
  Volume2,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface DebateRoomProps {
  debateType: 'ai' | '1v1' | 'mun';
  topic: string;
  onExit: () => void;
}

const DebateRoom = ({ debateType, topic, onExit }: DebateRoomProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>('student');
  const [speechText, setSpeechText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [feedback, setFeedback] = useState({
    fluency: 85,
    clarity: 78,
    relevance: 92,
    confidence: 88
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
    // Simulate speech recognition
    setTimeout(() => {
      setSpeechText("I believe that renewable energy is crucial for our future because it addresses climate change while creating sustainable economic opportunities...");
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTimerRunning(false);
    // Generate AI response
    setTimeout(() => {
      setAiResponse("While renewable energy is important, we must consider the economic transition costs and job displacement in traditional energy sectors. A gradual transition with proper retraining programs would be more practical...");
      setCurrentSpeaker('opponent');
    }, 1000);
  };

  const handleNextRound = () => {
    setCurrentSpeaker('student');
    setSpeechText('');
    setAiResponse('');
    setTimeRemaining(180);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Debate Room</h1>
          <p className="text-gray-600">{topic}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {debateType === 'ai' ? 'vs AI' : debateType === '1v1' ? '1v1 Match' : 'MUN Session'}
          </Badge>
          <Button variant="outline" onClick={onExit}>Exit Debate</Button>
        </div>
      </div>

      {/* Main Debate Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speech Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer and Controls */}
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{formatTime(timeRemaining)}</div>
                    <div className="text-sm text-gray-500">Time Remaining</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {currentSpeaker === 'student' ? 'Your Turn' : 'Opponent Speaking'}
                    </div>
                    <div className="text-sm text-gray-500">Current Speaker</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant={isTimerRunning ? "destructive" : "default"}
                    onClick={isTimerRunning ? () => setIsTimerRunning(false) : () => setIsTimerRunning(true)}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </Button>
                  
                  <Button variant="outline" onClick={() => setTimeRemaining(180)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speech Input */}
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
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
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

          {/* AI Response */}
          {aiResponse && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Opponent Response</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800">{aiResponse}</p>
                </div>
                <div className="mt-4 text-center">
                  <Button onClick={handleNextRound}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Continue Debate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Real-time Feedback */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Real-time Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Fluency</span>
                    <span className="text-sm text-gray-500">{feedback.fluency}%</span>
                  </div>
                  <Progress value={feedback.fluency} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Clarity</span>
                    <span className="text-sm text-gray-500">{feedback.clarity}%</span>
                  </div>
                  <Progress value={feedback.clarity} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Relevance</span>
                    <span className="text-sm text-gray-500">{feedback.relevance}%</span>
                  </div>
                  <Progress value={feedback.relevance} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Confidence</span>
                    <span className="text-sm text-gray-500">{feedback.confidence}%</span>
                  </div>
                  <Progress value={feedback.confidence} className="h-2" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Potential Score: 87/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <p>Speak clearly and maintain eye contact with the camera</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <p>Support your arguments with evidence and examples</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p>Listen carefully to your opponent's points</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                  <p>Avoid using filler words like "um" and "uh"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Controls */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5" />
                <span>Audio Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Test Microphone
              </Button>
              <Button variant="outline" className="w-full">
                Adjust Volume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
