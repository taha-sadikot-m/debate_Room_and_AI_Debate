
import { useState, useEffect } from 'react';
import DebateHeader from './debate/DebateHeader';
import DebateTimer from './debate/DebateTimer';
import SpeechInput from './debate/SpeechInput';
import AIResponse from './debate/AIResponse';
import RealtimeFeedback from './debate/RealtimeFeedback';
import DebateTips from './debate/DebateTips';
import AudioControls from './debate/AudioControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hand, MessageSquare } from 'lucide-react';

interface DebateRoomProps {
  debateType: 'ai' | '1v1' | 'mun';
  topic: string;
  onExit: () => void;
}

const DebateRoom = ({ debateType, topic, onExit }: DebateRoomProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>('student');
  const [speechText, setSpeechText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showPOIOption, setShowPOIOption] = useState(false);
  const [poiRequested, setPOIRequested] = useState(false);
  const [poiApproved, setPOIApproved] = useState(false);
  const [poiTimeRemaining, setPOITimeRemaining] = useState(30);
  const [debateFormat, setDebateFormat] = useState<'1v1' | 'extempore' | 'quickfire'>('1v1');
  const [feedback, setFeedback] = useState({
    id: 7.5,
    ego: 8.8,
    superego: 6.2,
    overall: 85
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

  // POI Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (poiApproved && poiTimeRemaining > 0) {
      interval = setInterval(() => {
        setPOITimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (poiTimeRemaining === 0) {
      setPOIApproved(false);
      setPOIRequested(false);
      setPOITimeRemaining(30);
    }
    return () => clearInterval(interval);
  }, [poiApproved, poiTimeRemaining]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
    // Simulate speech recognition
    setTimeout(() => {
      setSpeechText("I believe that renewable energy is crucial for our future because it addresses climate change while creating sustainable economic opportunities. The transition to clean energy will create millions of jobs while reducing our carbon footprint...");
      // Update feedback based on speech
      setFeedback({
        id: 7.8,
        ego: 8.5,
        superego: 7.2,
        overall: 87
      });
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTimerRunning(false);
    // Generate AI response and show POI option
    setTimeout(() => {
      setAiResponse("While renewable energy is important, we must consider the economic transition costs and job displacement in traditional energy sectors. A gradual transition with proper retraining programs would be more practical than rapid implementation...");
      setCurrentSpeaker('opponent');
      setShowPOIOption(true);
    }, 1000);
  };

  const handleRequestPOI = () => {
    setPOIRequested(true);
    // Simulate AI approval (80% chance)
    setTimeout(() => {
      const approved = Math.random() > 0.2;
      setPOIApproved(approved);
      if (!approved) {
        setPOIRequested(false);
        alert("POI request denied. The speaker will continue.");
      }
    }, 2000);
  };

  const handleNextRound = () => {
    setCurrentSpeaker('student');
    setSpeechText('');
    setAiResponse('');
    setShowPOIOption(false);
    setPOIRequested(false);
    setPOIApproved(false);
    setTimeRemaining(60);
    setPOITimeRemaining(30);
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleTimerReset = () => {
    setTimeRemaining(60);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <DebateHeader 
        topic={topic} 
        debateType={debateType} 
        onExit={onExit} 
      />

      {/* Debate Format Selection */}
      <Card className="card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Debate Format</h3>
              <p className="text-sm text-gray-500">Choose your preferred format</p>
            </div>
            <div className="flex space-x-2">
              {(['1v1', 'extempore', 'quickfire'] as const).map((format) => (
                <Button
                  key={format}
                  variant={debateFormat === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDebateFormat(format)}
                >
                  {format === '1v1' ? '1v1 Timed' : format.charAt(0).toUpperCase() + format.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DebateTimer
            timeRemaining={timeRemaining}
            isTimerRunning={isTimerRunning}
            currentSpeaker={currentSpeaker}
            onTimerToggle={handleTimerToggle}
            onTimerReset={handleTimerReset}
          />

          <SpeechInput
            isRecording={isRecording}
            currentSpeaker={currentSpeaker}
            speechText={speechText}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />

          {/* POI Section */}
          {(showPOIOption || poiRequested || poiApproved) && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hand className="h-5 w-5 text-orange-600" />
                  <span>Point of Information (POI)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showPOIOption && !poiRequested && !poiApproved && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      The opponent is speaking. Would you like to raise a Point of Information?
                    </p>
                    <Button onClick={handleRequestPOI} className="bg-orange-500 hover:bg-orange-600">
                      <Hand className="h-4 w-4 mr-2" />
                      Raise POI
                    </Button>
                  </div>
                )}

                {poiRequested && !poiApproved && (
                  <div className="text-center">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      POI Request Pending...
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">Waiting for speaker approval</p>
                  </div>
                )}

                {poiApproved && (
                  <div className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-700 mb-3">
                      POI Approved - {poiTimeRemaining}s remaining
                    </Badge>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">You have 30 seconds for your Point of Information</p>
                      <Button 
                        className="mt-2"
                        onClick={() => console.log('Start POI recording')}
                      >
                        Start POI Recording
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <AIResponse
            aiResponse={aiResponse}
            onNextRound={handleNextRound}
          />
        </div>

        <div className="space-y-6">
          {/* Enhanced Freud Feedback */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span>Freud Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Id (Instinctive)</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {feedback.id}/10
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ego (Rational)</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {feedback.ego}/10
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Superego (Moral)</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {feedback.superego}/10
                  </Badge>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Overall Score</p>
                <p className="text-2xl font-bold text-purple-600">{feedback.overall}/100</p>
                <p className="text-xs text-gray-600 mt-1">
                  "Strong rational arguments, work on emotional appeal"
                </p>
              </div>
            </CardContent>
          </Card>

          <DebateTips />
          <AudioControls />
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
