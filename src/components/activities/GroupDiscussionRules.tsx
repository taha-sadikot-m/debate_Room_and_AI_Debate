import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import PublicSpeakingSession from './PublicSpeakingSession';

interface GroupDiscussionRulesProps {
  onBack: () => void;
}

const GroupDiscussionRules = ({ onBack }: GroupDiscussionRulesProps) => {
  const [showSession, setShowSession] = useState(false);

  const activity = {
    id: 'group-discussion',
    title: '🗣️ Group Discussion',
    description: 'Engage in a collaborative discussion on current topics with multiple participants. Share your perspectives while listening to others.',
    duration: '15-20 minutes',
    tokens: '8-15 tokens',
    rules: [
      'Wait for your turn to speak - avoid interrupting others',
      'Support your points with relevant examples and evidence',
      'Listen actively and respond thoughtfully to other participants',
      'Maintain respectful tone even when disagreeing',
      'Stay focused on the topic and avoid going off-tangent',
      'Encourage participation from quieter group members',
      'Summarize key points when appropriate'
    ],
    aiSampleArgument: "I believe that renewable energy is crucial for our future. Consider this - solar power costs have dropped by 80% in the last decade, making it more accessible than ever. Countries like Denmark generate over 40% of their electricity from wind power, proving it's not just environmentally friendly but economically viable. What concerns me about fossil fuels is not just the environmental impact, but the long-term economic instability they create through price volatility."
  };

  if (showSession) {
    return (
      <PublicSpeakingSession
        activity={activity}
        onBack={() => setShowSession(false)}
        onComplete={onBack}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🗣️ Group Discussion</h1>
          <p className="text-gray-600 mt-2">Collaborative discussion with multiple participants</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>About Group Discussion</span>
          </CardTitle>
          <CardDescription>
            A structured conversation where participants share diverse perspectives on important topics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-800">Rules & Guidelines</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {activity.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-800">Format</h3>
            <p className="text-gray-700">
              Each participant will have a chance to share their views on a given topic.
              Listen actively and respond thoughtfully to other participants.
            </p>
          </div>
          
          <div className="text-center pt-6">
            <Button 
              onClick={() => setShowSession(true)}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              Start Practice Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupDiscussionRules;
