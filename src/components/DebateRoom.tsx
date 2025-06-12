import { useState, useEffect } from 'react';
import DebateHeader from './debate/DebateHeader';
import DebateTimer from './debate/DebateTimer';
import SpeechInput from './debate/SpeechInput';
import AIVoiceResponse from './debate/AIVoiceResponse';
import RealtimeFeedback from './debate/RealtimeFeedback';
import DebateTips from './debate/DebateTips';
import AudioControls from './debate/AudioControls';
import DebateScoring from './debate/DebateScoring';
import FreudianAnalysis from './debate/FreudianAnalysis';
import POIHandler from './debate/POIHandler';
import DebatePhaseIndicator from './debate/DebatePhaseIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hand, MessageSquare, Square, Trophy, Award, Target } from 'lucide-react';
import { useDebateAI } from '@/hooks/useDebateAI';

interface DebateRoomProps {
  debateType: 'ai' | '1v1' | 'mun';
  topic: string;
  language?: string;
  onExit: () => void;
}

interface WinnerDeclaration {
  winner: 'student' | 'opponent';
  score: { student: number; opponent: number };
  reasoning: string;
  criteria: {
    arguments: { student: number; opponent: number };
    evidence: { student: number; opponent: number };
    delivery: { student: number; opponent: number };
    rebuttals: { student: number; opponent: number };
  };
}

const DebateRoom = ({ debateType, topic, language = 'en', onExit }: DebateRoomProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>('student');
  const [speechText, setSpeechText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showPOIOption, setShowPOIOption] = useState(false);
  const [poiRequested, setPOIRequested] = useState(false);
  const [poiApproved, setPOIApproved] = useState(false);
  const [poiTimeRemaining, setPOITimeRemaining] = useState(30);
  const [debateFormat, setDebateFormat] = useState<'1v1' | 'extempore' | 'quickfire'>('1v1');
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [showWinnerDeclaration, setShowWinnerDeclaration] = useState(false);
  const [winnerData, setWinnerData] = useState<WinnerDeclaration | null>(null);
  const [feedback, setFeedback] = useState({
    id: 7.5,
    ego: 8.8,
    superego: 6.2,
    overall: 85
  });
  const [assignedSide] = useState<'FOR' | 'AGAINST'>(Math.random() > 0.5 ? 'FOR' : 'AGAINST');
  const [showScoring, setShowScoring] = useState(false);
  const [showFreudAnalysis, setShowFreudAnalysis] = useState(false);
  const [currentPOI, setCurrentPOI] = useState<string>('');
  const [showPOI, setShowPOI] = useState(false);
  const [latestScores, setLatestScores] = useState(null);
  const [latestFreudAnalysis, setLatestFreudAnalysis] = useState(null);

  const debateAI = useDebateAI({
    topic,
    theme: 'General',
    assignedSide
  });

  const generateAIResponse = (userSpeech: string) => {
    const responses: Record<string, string> = {
      'en': "While renewable energy is important, we must consider the economic transition costs and job displacement in traditional energy sectors. A gradual transition with proper retraining programs would be more practical than rapid implementation...",
      'hi': "जबकि नवीकरणीय ऊर्जा महत्वपूर्ण है, हमें पारंपरिक ऊर्जा क्षेत्रों में आर्थिक संक्रमण लागत और नौकरी विस्थापन पर विचार करना चाहिए। उचित पुनः प्रशिक्षण कार्यक्रमों के साथ क्रमिक संक्रमण तीव्र कार्यान्वयन से अधिक व्यावहारिक होगा...",
      'ta': "புதுப்பிக்கத்தக்க ஆற்றல் முக்கியமானது என்றாலும், பாரம்பரிய ஆற்றல் துறைகளில் பொருளாதார மாற்றம் செலவுகள் மற்றும் வேலை இடப்பெயர்ச்சியை நாம் கருத்தில் கொள்ள வேண்டும். சரியான மறுபயிற்சி திட்டங்களுடன் படிப்படியான மாற்றம் விரைவான செயல்படுத்தலை விட மிகவும் நடைமுறையானதாக இருக்கும்..."
    };
    
    return responses[language] || responses['en'];
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      if (isRecording) {
        handleStopRecording();
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, isRecording]);

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

  const generateWinnerDeclaration = (): WinnerDeclaration => {
    // Simulate analysis based on various factors
    const studentArgs = Math.floor(Math.random() * 30) + 70; // 70-100
    const opponentArgs = Math.floor(Math.random() * 30) + 65; // 65-95
    
    const studentEvidence = Math.floor(Math.random() * 25) + 75;
    const opponentEvidence = Math.floor(Math.random() * 25) + 70;
    
    const studentDelivery = feedback.overall || Math.floor(Math.random() * 20) + 80;
    const opponentDelivery = Math.floor(Math.random() * 25) + 70;
    
    const studentRebuttals = Math.floor(Math.random() * 30) + 70;
    const opponentRebuttals = Math.floor(Math.random() * 30) + 65;

    const studentTotal = (studentArgs + studentEvidence + studentDelivery + studentRebuttals) / 4;
    const opponentTotal = (opponentArgs + opponentEvidence + opponentDelivery + opponentRebuttals) / 4;

    const winner = studentTotal > opponentTotal ? 'student' : 'opponent';
    const margin = Math.abs(studentTotal - opponentTotal);

    let reasoning = '';
    if (winner === 'student') {
      reasoning = `You won this debate round! Your performance was strong across multiple areas. `;
      if (studentArgs > opponentArgs + 5) reasoning += `Your arguments were particularly compelling and well-structured. `;
      if (studentEvidence > opponentEvidence + 5) reasoning += `You provided excellent evidence to support your position. `;
      if (studentDelivery > opponentDelivery + 5) reasoning += `Your delivery was confident and engaging. `;
      if (margin < 5) reasoning += `However, it was a close debate - your opponent presented solid counterpoints.`;
      else reasoning += `You maintained a clear advantage throughout the round.`;
    } else {
      reasoning = `Your opponent won this round. `;
      if (opponentArgs > studentArgs + 5) reasoning += `They presented stronger and more logical arguments. `;
      if (opponentEvidence > studentEvidence + 5) reasoning += `Their evidence was more compelling and relevant. `;
      if (opponentDelivery > studentDelivery + 5) reasoning += `Their delivery was more persuasive. `;
      if (margin < 5) reasoning += `But it was very close - you held your ground well and made valid points.`;
      else reasoning += `Focus on strengthening your argument structure and evidence for the next round.`;
    }

    return {
      winner,
      score: { student: Math.round(studentTotal), opponent: Math.round(opponentTotal) },
      reasoning,
      criteria: {
        arguments: { student: studentArgs, opponent: opponentArgs },
        evidence: { student: studentEvidence, opponent: opponentEvidence },
        delivery: { student: studentDelivery, opponent: opponentDelivery },
        rebuttals: { student: studentRebuttals, opponent: opponentRebuttals }
      }
    };
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
    
    // Show POI only in the last 15-30 seconds of speech (30% chance)
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const poi = debateAI.generatePOI();
        setCurrentPOI(poi);
        setShowPOI(true);
      }, Math.random() * 15000 + 45000); // 45-60 seconds into speech (towards the end)
    }

    // Simulate speech recognition
    setTimeout(() => {
      const speechTexts: Record<string, string> = {
        'en': "I believe that renewable energy is crucial for our future because it addresses climate change while creating sustainable economic opportunities. The transition to clean energy will create millions of jobs while reducing our carbon footprint...",
        'hi': "मेरा मानना है कि नवीकरणीय ऊर्जा हमारे भविष्य के लिए महत्वपूर्ण है क्योंकि यह जलवायु परिवर्तन को संबोधित करती है और साथ ही टिकाऊ आर्थिक अवसर भी बनाती है। स्वच्छ ऊर्जा की ओर संक्रमण लाखों नौकरियां पैदा करेगा...",
        'ta': "நான் நம்புகிறேன் நவீकரிக்கத்தக்க ஆற்றல் எங்கள் எதிர்காலத்திற்கு முக்கியமானது ஏனென்றால் அது காலநிலை மாற்றத்தை நிவர்த்தி செய்கிறது மற்றும் நிலையான பொருளாதார வாய்ப்புகளை உருவாக்குகிறது. சுத்தமான ஆற்றலுக்கான மாற்றம் மில்லியன் கணக்கான வேலைகளை உருவாக்கும்..."
      };
      
      setSpeechText(speechTexts[language] || speechTexts['en']);
      setFeedback({
        id: 7.8,
        ego: 8.5,
        superego: 7.2,
        overall: 87
      });
    }, 2000);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsTimerRunning(false);
    
    // Generate scores and analysis
    const scores = await debateAI.scoreUserSpeech(speechText);
    const freudAnalysis = await debateAI.analyzeFreudian(speechText);
    
    setLatestScores(scores);
    setLatestFreudAnalysis(freudAnalysis);
    setShowScoring(true);
    setShowFreudAnalysis(true);
    
    // Generate AI response
    setTimeout(async () => {
      const response = await debateAI.generateAIResponse(speechText);
      setAiResponse(response);
      setCurrentSpeaker('opponent');
    }, 1000);
  };

  const handlePOIAccept = () => {
    setShowPOI(false);
    // Allow 30 seconds for POI response
    setTimeout(() => {
      console.log('POI response time ended');
    }, 30000);
  };

  const handlePOIDecline = () => {
    setShowPOI(false);
    setCurrentPOI('');
  };

  const handlePOITimeout = () => {
    setShowPOI(false);
    setCurrentPOI('');
  };

  const handleNextRound = () => {
    debateAI.advanceDebatePhase();
    
    const newRoundsCompleted = roundsCompleted + 1;
    setRoundsCompleted(newRoundsCompleted);
    
    if (newRoundsCompleted >= 3) { // 3 phases: opening, rebuttal, closing
      const winner = generateWinnerDeclaration();
      setWinnerData(winner);
      setShowWinnerDeclaration(true);
    } else {
      setCurrentSpeaker('student');
      setSpeechText('');
      setAiResponse('');
      setShowScoring(false);
      setShowFreudAnalysis(false);
      setTimeRemaining(60);
    }
  };

  const handleNewDebate = () => {
    setShowWinnerDeclaration(false);
    setWinnerData(null);
    setRoundsCompleted(0);
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

  if (showWinnerDeclaration && winnerData) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="card-shadow-lg border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-3xl font-bold text-gray-900">
                Debate Complete!
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Winner Announcement */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🏆 {winnerData.winner === 'student' ? 'You Win!' : 'Opponent Wins!'}
              </h2>
              <div className="flex justify-center space-x-4 mb-4">
                <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-100 text-blue-700">
                  You: {winnerData.score.student}/100
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2 bg-red-100 text-red-700">
                  Opponent: {winnerData.score.opponent}/100
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {winnerData.reasoning}
              </p>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Performance Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(winnerData.criteria).map(([criterion, scores]) => (
                    <div key={criterion} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{criterion}</span>
                        <div className="flex space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            You: {scores.student}
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Opp: {scores.opponent}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {winnerData.winner === 'student' ? (
                      <>
                        <p className="text-green-700">✓ Strong logical reasoning</p>
                        <p className="text-green-700">✓ Effective use of evidence</p>
                        <p className="text-green-700">✓ Confident delivery</p>
                      </>
                    ) : (
                      <>
                        <p className="text-blue-700">• Good foundational arguments</p>
                        <p className="text-blue-700">• Maintained composure</p>
                        <p className="text-blue-700">• Room for improvement in rebuttals</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button onClick={handleNewDebate} className="bg-green-500 hover:bg-green-600">
                Start New Debate
              </Button>
              <Button variant="outline" onClick={onExit}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <DebateHeader 
        topic={topic} 
        debateType={debateType} 
        onExit={onExit} 
      />

      {/* Debate Phase and Assignment */}
      <DebatePhaseIndicator 
        currentRound={debateAI.currentRound}
        phase={debateAI.debatePhase}
        assignedSide={assignedSide}
      />

      {/* Language Indicator */}
      <Card className="card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Debate Language</h3>
              <p className="text-sm text-gray-500">
                {language === 'hi' ? 'हिन्दी' : language === 'ta' ? 'தமிழ்' : 'English'}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {language.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* POI Handler */}
      <POIHandler
        poiText={currentPOI}
        isActive={showPOI}
        onAccept={handlePOIAccept}
        onDecline={handlePOIDecline}
        onTimeout={handlePOITimeout}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DebateTimer
            timeRemaining={timeRemaining}
            isTimerRunning={isTimerRunning}
            currentSpeaker={currentSpeaker}
            onTimerToggle={() => setIsTimerRunning(!isTimerRunning)}
            onTimerReset={() => setTimeRemaining(60)}
          />

          <SpeechInput
            isRecording={isRecording}
            currentSpeaker={currentSpeaker}
            speechText={speechText}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />

          {/* Scoring and Analysis */}
          {latestScores && (
            <DebateScoring scores={latestScores} isVisible={showScoring} />
          )}

          {latestFreudAnalysis && (
            <FreudianAnalysis analysis={latestFreudAnalysis} isVisible={showFreudAnalysis} />
          )}

          {isRecording && (
            <Card className="card-shadow border-orange-200">
              <CardContent className="p-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleStopRecording}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording Early
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  You can stop before the minute is up
                </p>
              </CardContent>
            </Card>
          )}

          <AIVoiceResponse
            aiResponse={aiResponse}
            language={language}
            onNextRound={handleNextRound}
          />
        </div>

        <div className="space-y-6">
          {/* Real-time feedback during recording */}
          <RealtimeFeedback feedback={{
            fluency: 85,
            clarity: 90,
            relevance: 88,
            confidence: 82
          }} />

          <DebateTips />
          <AudioControls />
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
