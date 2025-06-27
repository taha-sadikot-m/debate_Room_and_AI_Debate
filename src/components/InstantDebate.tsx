import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  User, 
  Bot,
  Trophy,
  BarChart3
} from 'lucide-react';
import { debateAI } from '@/services/debateAI';
import { useToast } from '@/hooks/use-toast';

interface InstantDebateProps {
  onBack: () => void;
}

interface DebateMessage {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface DebateEvaluation {
  score: number;
  breakdown: Record<string, number>;
  strengths: string[];
  improvements: string[];
  argumentAnalysis: Array<{
    excerpt: string;
    feedback: string;
    suggestion: string;
  }>;
  finalRemarks: string;
}

const InstantDebate: React.FC<InstantDebateProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'debate' | 'evaluation'>('setup');
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [evaluation, setEvaluation] = useState<DebateEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        setCurrentMessage(prev => prev + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Speech recognition error",
          description: "Please try typing your message instead.",
          variant: "destructive"
        });
      };
    }
  }, [toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startDebate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a debate topic to continue.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep('debate');
    
    // If AI speaks first, generate initial message
    if (firstSpeaker === 'ai') {
      setIsAIResponding(true);
      try {
        const aiResponse = await debateAI.generateDebateResponse(
          topic,
          userPosition === 'for' ? 'against' : 'for',
          []
        );
        
        const aiMessage: DebateMessage = {
          id: Date.now().toString(),
          speaker: 'ai',
          text: aiResponse,
          timestamp: new Date()
        };
        
        setMessages([aiMessage]);
        
        // Play AI response if not muted
        if (!isMuted) {
          playAIResponse(aiResponse);
        }
      } catch (error) {
        console.error('Error generating AI response:', error);
        toast({
          title: "Error",
          description: "Failed to generate AI response. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsAIResponding(false);
      }
    }
  };

  const submitArgument = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: DebateMessage = {
      id: Date.now().toString(),
      speaker: 'user',
      text: currentMessage.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsAIResponding(true);

    try {
      const aiResponse = await debateAI.generateDebateResponse(
        topic,
        userPosition === 'for' ? 'against' : 'for',
        newMessages
      );

      const aiMessage: DebateMessage = {
        id: (Date.now() + 1).toString(),
        speaker: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages([...newMessages, aiMessage]);

      // Play AI response if not muted
      if (!isMuted) {
        playAIResponse(aiResponse);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIResponding(false);
    }
  };

  const playAIResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech recognition not supported",
        description: "Please type your message instead.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const endDebateAndEvaluate = async () => {
    if (messages.length < 2) {
      toast({
        title: "Debate too short",
        description: "Please have at least one exchange before ending the debate.",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const evaluationResult = await debateAI.evaluatePerformance(messages);
      if (evaluationResult) {
        setEvaluation(evaluationResult);
        setCurrentStep('evaluation');
      } else {
        throw new Error('Failed to evaluate performance');
      }
    } catch (error) {
      console.error('Error evaluating debate:', error);
      toast({
        title: "Evaluation Error",
        description: "Failed to evaluate your performance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitArgument();
    }
  };

  if (currentStep === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        <Card className="card-shadow-lg border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-indigo-700 mb-2">🤖 Instant AI Debate</CardTitle>
            <CardDescription className="text-lg">
              Start debating with AI in seconds - choose your topic and dive in!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Debate Topic</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter any topic you want to debate about..."
                className="text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Position</label>
                <Select value={userPosition} onValueChange={(value: 'for' | 'against') => setUserPosition(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for">In Favor (Supporting)</SelectItem>
                    <SelectItem value="against">Against (Opposing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Who Speaks First?</label>
                <Select value={firstSpeaker} onValueChange={(value: 'user' | 'ai') => setFirstSpeaker(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">I'll start</SelectItem>
                    <SelectItem value="ai">AI starts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={startDebate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-semibold"
              size="lg"
            >
              🚀 Start Instant Debate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'evaluation' && evaluation) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <Button
            onClick={() => {
              setCurrentStep('setup');
              setMessages([]);
              setTopic('');
              setEvaluation(null);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Start New Debate
          </Button>
        </div>

        <Card className="card-shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl text-green-700">Debate Performance</CardTitle>
            <CardDescription className="text-lg">
              Here's how you performed in your debate about "{topic}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{evaluation.score}</div>
              <div className="text-gray-600">out of 100</div>
            </div>

            {evaluation.strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">💪 Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {evaluation.improvements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">🎯 Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {evaluation.finalRemarks && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-700">📝 Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{evaluation.finalRemarks}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center space-x-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isMuted ? 'Unmute' : 'Mute'} AI</span>
          </Button>
          <Button
            onClick={endDebateAndEvaluate}
            className="bg-green-600 hover:bg-green-700"
            disabled={isEvaluating || messages.length < 2}
          >
            {isEvaluating ? (
              <>
                <BarChart3 className="h-4 w-4 mr-2 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4 mr-2" />
                End & Evaluate
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="card-shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">{topic}</CardTitle>
          <div className="flex justify-between text-sm text-gray-600">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              You: {userPosition === 'for' ? 'In Favor' : 'Against'}
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              AI: {userPosition === 'for' ? 'Against' : 'In Favor'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg p-4 border rounded-lg ${
                  message.speaker === 'user' 
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-900' 
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}>
                  <div className="font-semibold mb-1 flex items-center space-x-2">
                    {message.speaker === 'user' ? (
                      <>
                        <User className="h-4 w-4" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        <span>AI</span>
                      </>
                    )}
                  </div>
                  <div>{message.text}</div>
                </div>
              </div>
            ))}
            
            {isAIResponding && (
              <div className="flex justify-start">
                <div className="max-w-lg p-4 border rounded-lg bg-gray-100 border-gray-300">
                  <div className="font-semibold mb-1 flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <span>AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Thinking...</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-end space-x-3">
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              className="p-3"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your argument... (Press Enter to send, Shift+Enter for new line)"
              className="flex-grow min-h-[80px]"
              disabled={isAIResponding}
            />
            <Button
              onClick={submitArgument}
              className="bg-indigo-600 hover:bg-indigo-700 p-3 h-[80px]"
              disabled={!currentMessage.trim() || isAIResponding}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDebate;
