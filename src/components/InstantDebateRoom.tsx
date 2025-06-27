import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Send, Bot, User, Volume2, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InstantDebateRoomProps {
  config: DebateConfig;
  onBack: () => void;
  onExit: () => void;
}

interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
}

interface Message {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const InstantDebateRoom = ({ config, onBack, onExit }: InstantDebateRoomProps) => {
  console.log('InstantDebateRoom rendered with config:', config);
  
  // Safety check for config
  if (!config) {
    console.error('No config provided to InstantDebateRoom');
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600 mb-4">No debate configuration provided.</p>
          <Button onClick={onBack}>Back to Setup</Button>
        </div>
      </div>
    );
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [debateEnded, setDebateEnded] = useState(false);
  const [argumentCount, setArgumentCount] = useState(0);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize AI first message if AI speaks first
    if (config.firstSpeaker === 'ai') {
      generateAIResponse([]);
    }
  }, []);

  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        setCurrentMessage(prev => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      return recognition;
    }
    return null;
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }

    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const generateAIResponse = async (currentMessages: Message[]) => {
    setIsAIThinking(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate contextual AI response based on the topic and position
    const aiPosition = config.userPosition === 'for' ? 'against' : 'for';
    const responses = getAIResponses(config.topic, aiPosition, currentMessages.length);
    
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const newMessage: Message = {
      id: Date.now().toString(),
      speaker: 'ai',
      text: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsAIThinking(false);
    
    // Optional: Add text-to-speech for AI response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const getAIResponses = (topic: string, position: string, messageCount: number): string[] => {
    const isFor = position === 'for';
    const phase = messageCount < 2 ? 'opening' : messageCount < 6 ? 'middle' : 'closing';
    
    const responses = {
      opening: {
        for: [
          `I strongly support the position on ${topic}. The evidence clearly shows significant benefits that cannot be ignored. Research indicates positive outcomes when we implement these measures effectively.`,
          `There are compelling reasons to be in favor of ${topic}. The logical progression of evidence supports this stance, and we can see real-world examples where this approach has worked effectively.`,
          `I believe ${topic} is absolutely necessary. The data demonstrates clear advantages, and the potential for positive impact on society is substantial.`
        ],
        against: [
          `I must respectfully oppose ${topic}. The evidence suggests significant concerns that cannot be overlooked. Historical precedent shows us the potential pitfalls of this approach.`,
          `While the topic seems appealing, we must consider the broader implications of ${topic}. The risks and unintended consequences are too significant to ignore.`,
          `I'm against ${topic} because the potential negative outcomes outweigh the perceived benefits. We must be cautious about implementing policies without considering all stakeholders.`
        ]
      },
      middle: {
        for: [
          `Your concerns are valid, but the benefits of ${topic} far outweigh the risks. The implementation can be carefully managed to address these issues.`,
          `While you raise important points, the evidence still strongly supports ${topic}. We can develop safeguards to mitigate the concerns you've mentioned.`,
          `I understand your perspective, but we cannot let fear prevent us from making necessary progress on ${topic}. The potential for positive change is too great.`
        ],
        against: [
          `Your arguments don't adequately address the fundamental problems with ${topic}. The risks are more severe than you're acknowledging.`,
          `The evidence you cite doesn't account for all variables. We must consider the long-term consequences and potential harm to vulnerable populations.`,
          `While your passion is admirable, emotion shouldn't override careful analysis of the potential negative impacts of ${topic}.`
        ]
      },
      closing: {
        for: [
          `In conclusion, the evidence overwhelmingly supports ${topic}. We've demonstrated clear benefits, addressed counterarguments, and shown practical applications. The logical choice is clear.`,
          `To summarize, ${topic} represents a necessary step forward. The benefits are documented, the risks are manageable, and the potential for positive impact is substantial.`,
          `The debate has reinforced why ${topic} is so important. Despite valid concerns, the evidence points to significant advantages that we cannot afford to ignore.`
        ],
        against: [
          `In summary, the risks and concerns surrounding ${topic} are too significant to ignore. We've highlighted critical flaws and demonstrated why caution is necessary.`,
          `The debate has shown that ${topic} poses more risks than benefits. The potential for unintended consequences requires us to reconsider this approach entirely.`,
          `To conclude, the evidence against ${topic} is compelling. The responsible choice is to reject this approach and seek better alternatives.`
        ]
      }
    };

    return responses[phase][isFor ? 'for' : 'against'];
  };

  const submitArgument = async () => {
    if (!currentMessage.trim() || isAIThinking || debateEnded) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      speaker: 'user',
      text: currentMessage.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');
    setArgumentCount(prev => prev + 1);

    // Check if debate should end (after 6-8 exchanges)
    if (argumentCount >= 5) {
      setDebateEnded(true);
      toast({
        title: "Debate Complete!",
        description: "Great debate! You can review the conversation or start a new debate.",
      });
      return;
    }

    // Generate AI response
    await generateAIResponse(updatedMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitArgument();
    }
  };

  const endDebate = () => {
    setDebateEnded(true);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    toast({
      title: "Debate Ended",
      description: "Thanks for the engaging debate! Review your arguments above.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instant AI Debate</h1>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline" className="text-blue-700 bg-blue-50">
              Topic: {config.topic}
            </Badge>
            <Badge variant={config.userPosition === 'for' ? 'default' : 'destructive'}>
              Your Position: {config.userPosition === 'for' ? 'In Favor' : 'Against'}
            </Badge>
            <Badge variant="secondary">
              AI Position: {config.userPosition === 'for' ? 'Against' : 'In Favor'}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="destructive" onClick={endDebate} disabled={debateEnded}>
            End Debate
          </Button>
        </div>
      </div>

      {/* Debate Chat Container */}
      <Card className="card-shadow-lg">
        <CardHeader>
          <CardTitle>Debate Room</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages Container */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg p-4 rounded-lg border ${
                    message.speaker === 'user'
                      ? 'bg-blue-100 border-blue-300 self-end'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-700 mb-1 flex items-center">
                    {message.speaker === 'user' ? (
                      <>
                        <User className="h-4 w-4 mr-2 text-blue-600" />
                        You
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2 text-gray-600" />
                        AI Opponent
                      </>
                    )}
                  </div>
                  <div className="text-gray-800">{message.text}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {/* AI Thinking Indicator */}
            {isAIThinking && (
              <div className="flex justify-start">
                <div className="max-w-lg p-4 rounded-lg border bg-gray-100 border-gray-300">
                  <div className="font-semibold text-gray-700 mb-1 flex items-center">
                    <Bot className="h-4 w-4 mr-2 text-gray-600" />
                    AI Opponent
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="animate-pulse">Thinking</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!debateEnded && (
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your argument here..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[80px] resize-none"
                  disabled={isAIThinking}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={toggleSpeechRecognition}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className="h-10 w-10"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={submitArgument}
                  disabled={!currentMessage.trim() || isAIThinking}
                  size="icon"
                  className="h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Debate Complete Message */}
          {debateEnded && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Debate Complete!</h3>
              <p className="text-gray-600 mb-4">Great debate! You exchanged {messages.length} arguments.</p>
              <div className="flex justify-center space-x-4">
                <Button onClick={onBack} variant="outline">
                  Start New Debate
                </Button>
                <Button onClick={onExit}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDebateRoom;
