import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Send, Bot, User, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InstantDebateRoomV2Props {
  config: DebateConfig;
  onBack: () => void;
  onExit: () => void;
  onDebateComplete?: (config: DebateConfig, messages: Message[]) => void;
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

const InstantDebateRoomV2 = ({ config, onBack, onExit, onDebateComplete }: InstantDebateRoomV2Props) => {
  console.log('InstantDebateRoomV2 rendered with config:', config);
  
  // Safety check for config
  if (!config) {
    console.error('No config provided to InstantDebateRoomV2');
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
    console.log('InstantDebateRoomV2 useEffect triggered, config:', config);
    // Initialize AI first message if AI speaks first
    if (config && config.firstSpeaker === 'ai') {
      console.log('AI speaks first, generating initial message');
      setTimeout(() => generateAIResponse([]), 500);
    }
  }, [config]);

  // Advanced AI response generation based on AI_Platform_Debate logic
  const generateAIResponse = async (currentMessages: Message[]) => {
    console.log('Generating AI response for messages:', currentMessages);
    setIsAIThinking(true);
    
    // Simulate AI thinking time (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiPosition = config.userPosition === 'for' ? 'against' : 'for';
    const messageCount = currentMessages.length;
    
    // Generate contextual response based on the AI_Platform_Debate approach
    const aiResponse = generateContextualResponse(config.topic, aiPosition, messageCount, currentMessages);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      speaker: 'ai',
      text: aiResponse,
      timestamp: new Date()
    };

    console.log('Generated AI message:', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setIsAIThinking(false);
    
    // Add text-to-speech for AI response
    if ('speechSynthesis' in window && aiResponse) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('English')) || null;
      speechSynthesis.speak(utterance);
    }
  };

  // Generate contextual AI responses based on debate flow
  const generateContextualResponse = (topic: string, position: string, messageCount: number, messages: Message[]): string => {
    const isFor = position === 'for';
    const phase = messageCount === 0 ? 'opening' : messageCount < 4 ? 'middle' : 'closing';
    
    // Get last user message for context
    const lastUserMessage = messages.filter(m => m.speaker === 'user').pop()?.text || '';
    
    // Base responses similar to AI_Platform_Debate
    const responseTemplates = {
      opening: {
        for: [
          `I strongly advocate for ${topic}. The evidence overwhelmingly demonstrates significant benefits that we cannot afford to ignore. Research consistently shows positive outcomes when we implement these measures effectively, and the potential for societal advancement is substantial.`,
          `There are compelling reasons to support ${topic}. The logical progression of evidence clearly supports this position, and we can observe real-world examples where this approach has yielded remarkable results and improved lives.`,
          `I firmly believe ${topic} is not just beneficial but essential for our progress. The data demonstrates clear advantages, measurable improvements, and the potential for transformative positive impact on society as a whole.`
        ],
        against: [
          `I must respectfully but firmly oppose ${topic}. The evidence reveals significant concerns and potential risks that cannot be overlooked or dismissed. Historical precedent warns us about the unintended consequences of such approaches.`,
          `While the concept may seem appealing on the surface, we must critically examine the broader implications of ${topic}. The risks, costs, and potential negative outcomes far outweigh any perceived benefits.`,
          `I stand against ${topic} because the potential for harm is too great. We must prioritize caution and consider the vulnerable populations who could be adversely affected by these policies.`
        ]
      },
      middle: {
        for: [
          `Your concerns, while understandable, don't adequately address the overwhelming benefits of ${topic}. The implementation challenges you mention can be effectively managed through careful planning and progressive rollout strategies.`,
          `I appreciate your perspective, but the evidence still strongly supports ${topic}. We can develop robust safeguards and monitoring systems to mitigate the concerns you've raised while maximizing the benefits.`,
          `While you raise valid points, we cannot let fear of potential issues prevent us from making necessary progress on ${topic}. The status quo is unacceptable, and the potential for positive change is too significant to ignore.`
        ],
        against: [
          `Your arguments fail to address the fundamental structural problems with ${topic}. The risks I've outlined are not merely theoretical - they represent serious threats that demand our immediate attention and concern.`,
          `The evidence you cite is incomplete and doesn't account for critical variables. We must consider the long-term consequences, potential for exploitation, and the disproportionate impact on marginalized communities.`,
          `While your passion is admirable, emotional appeals cannot override careful analysis of the documented negative impacts of ${topic}. The data clearly shows more harm than benefit.`
        ]
      },
      closing: {
        for: [
          `In conclusion, the evidence overwhelmingly supports ${topic}. Throughout this debate, we've demonstrated clear benefits, addressed legitimate concerns, and shown practical pathways for implementation. The logical choice is unmistakably clear.`,
          `To summarize our discussion, ${topic} represents a necessary and beneficial step forward. The advantages are well-documented, the risks are manageable, and the potential for positive societal impact is too substantial to ignore.`,
          `This debate has reinforced why ${topic} is so crucial for our future. Despite valid concerns raised, the preponderance of evidence points to significant advantages that we simply cannot afford to overlook.`
        ],
        against: [
          `In summary, the risks and concerns surrounding ${topic} are too significant and too numerous to ignore. Throughout this debate, we've highlighted critical flaws and demonstrated why extreme caution is not just warranted but necessary.`,
          `This debate has clearly shown that ${topic} poses more risks than benefits. The potential for unintended consequences, harm to vulnerable populations, and systemic disruption requires us to fundamentally reconsider this approach.`,
          `To conclude, the evidence against ${topic} is compelling and comprehensive. The responsible choice is to reject this approach entirely and seek alternative solutions that don't carry such significant risks.`
        ]
      }
    };

    const responses = responseTemplates[phase][isFor ? 'for' : 'against'];
    let selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add contextual elements based on user's last message
    if (lastUserMessage && phase !== 'opening') {
      const contextualPhrases = [
        "You mentioned that ",
        "While you argue that ",
        "I understand you believe that ",
        "Your point about ",
        "Regarding your statement that "
      ];
      
      const responsePhrases = isFor ? [
        ", but I maintain that the benefits outweigh these concerns because ",
        ", however, this actually strengthens the case for our position since ",
        ", yet this overlooks the fundamental advantages of ",
        ", but we must consider the broader positive implications of "
      ] : [
        ", which actually reinforces my concerns about ",
        ", but this highlights exactly why we should be cautious about ",
        ", and this demonstrates the serious problems with ",
        ", which perfectly illustrates the dangers of "
      ];
      
      // Sometimes add contextual response (30% chance)
      if (Math.random() < 0.3 && lastUserMessage.length > 20) {
        const contextPhrase = contextualPhrases[Math.floor(Math.random() * contextualPhrases.length)];
        const responsePhrase = responsePhrases[Math.floor(Math.random() * responsePhrases.length)];
        selectedResponse = `${contextPhrase}${lastUserMessage.substring(0, 40)}...${responsePhrase}${selectedResponse.substring(20)}`;
      }
    }
    
    return selectedResponse;
  };

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

  const submitArgument = async () => {
    if (!currentMessage.trim() || isAIThinking || debateEnded) return;

    console.log('Submitting user argument:', currentMessage.trim());

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
      // Call the evaluation callback if provided
      if (onDebateComplete) {
        onDebateComplete(config, updatedMessages);
      }
      toast({
        title: "Debate Complete!",
        description: "Excellent debate! You can review the conversation or start a new debate.",
      });
      return;
    }

    // Generate AI response after a short delay
    setTimeout(() => {
      generateAIResponse(updatedMessages);
    }, 500);
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
    // Call the evaluation callback if provided
    if (onDebateComplete) {
      onDebateComplete(config, messages);
    }
    toast({
      title: "Debate Ended",
      description: "Thank you for the engaging debate! Review your arguments above.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 Instant AI Debate</h1>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline" className="text-blue-700 bg-blue-50">
              📝 {config.topic}
            </Badge>
            <Badge variant={config.userPosition === 'for' ? 'default' : 'destructive'}>
              You: {config.userPosition === 'for' ? '✅ In Favor' : '❌ Against'}
            </Badge>
            <Badge variant="secondary">
              AI: {config.userPosition === 'for' ? '❌ Against' : '✅ In Favor'}
            </Badge>
            <Badge variant="outline">
              Exchanges: {argumentCount}/6
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
          <CardTitle className="flex items-center justify-between">
            <span>💬 Debate Room</span>
            <Badge variant="outline" className="text-sm">
              {messages.length} messages
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages Container */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg bg-gray-50">
            {messages.length === 0 && !isAIThinking && (
              <div className="text-center py-8 text-gray-500">
                <p>The debate is about to begin...</p>
                <p className="text-sm">
                  {config.firstSpeaker === 'user' ? 'You speak first!' : 'AI will start the debate.'}
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg p-4 rounded-lg border shadow-sm ${
                    message.speaker === 'user'
                      ? 'bg-blue-100 border-blue-300 self-end'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-700 mb-2 flex items-center">
                    {message.speaker === 'user' ? (
                      <>
                        <User className="h-4 w-4 mr-2 text-blue-600" />
                        You ({config.userPosition === 'for' ? 'For' : 'Against'})
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2 text-gray-600" />
                        AI Opponent ({config.userPosition === 'for' ? 'Against' : 'For'})
                      </>
                    )}
                  </div>
                  <div className="text-gray-800 leading-relaxed">{message.text}</div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    <span>#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* AI Thinking Indicator */}
            {isAIThinking && (
              <div className="flex justify-start">
                <div className="max-w-lg p-4 rounded-lg border bg-yellow-50 border-yellow-300">
                  <div className="font-semibold text-gray-700 mb-1 flex items-center">
                    <Bot className="h-4 w-4 mr-2 text-gray-600" />
                    AI Opponent
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse text-yellow-700">🤔 Thinking carefully...</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!debateEnded && (
            <div className="space-y-3">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your argument here... (Press Enter to send, Shift+Enter for new line)"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[100px] resize-none"
                    disabled={isAIThinking}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={toggleSpeechRecognition}
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    className="h-12 w-12"
                    title={isListening ? "Stop voice input" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    onClick={submitArgument}
                    disabled={!currentMessage.trim() || isAIThinking}
                    size="icon"
                    className="h-12 w-12"
                    title="Send argument"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                💡 Use clear, logical arguments. The AI will respond to your points in real-time.
              </div>
            </div>
          )}

          {/* Debate Complete Message */}
          {debateEnded && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">🎉 Debate Complete!</h3>
              <p className="text-gray-600 mb-4">
                Excellent debate! You exchanged {messages.length} arguments on "{config.topic}".
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Your position: <strong>{config.userPosition === 'for' ? 'In Favor' : 'Against'}</strong> | 
                AI position: <strong>{config.userPosition === 'for' ? 'Against' : 'In Favor'}</strong>
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => onDebateComplete?.(config, messages)} className="bg-blue-500 hover:bg-blue-600">
                  📊 View Evaluation
                </Button>
                <Button onClick={onBack} variant="outline">
                  🆕 Start New Debate
                </Button>
                <Button onClick={onExit} variant="outline">
                  🏠 Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDebateRoomV2;
