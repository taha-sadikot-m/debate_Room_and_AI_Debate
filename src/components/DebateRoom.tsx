
import { useState, useEffect } from 'react';
import DebateHeader from './debate/DebateHeader';
import DebateTimer from './debate/DebateTimer';
import SpeechInput from './debate/SpeechInput';
import AIResponse from './debate/AIResponse';
import RealtimeFeedback from './debate/RealtimeFeedback';
import DebateTips from './debate/DebateTips';
import AudioControls from './debate/AudioControls';

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

  const handleTimerToggle = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
    }
  };

  const handleTimerReset = () => {
    setTimeRemaining(180);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <DebateHeader 
        topic={topic} 
        debateType={debateType} 
        onExit={onExit} 
      />

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

          <AIResponse
            aiResponse={aiResponse}
            onNextRound={handleNextRound}
          />
        </div>

        <div className="space-y-6">
          <RealtimeFeedback feedback={feedback} />
          <DebateTips />
          <AudioControls />
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
