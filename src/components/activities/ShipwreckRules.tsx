import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target } from 'lucide-react';
import PublicSpeakingSession from './PublicSpeakingSession';

interface ShipwreckRulesProps {
  onBack: () => void;
}

const ShipwreckRules = ({ onBack }: ShipwreckRulesProps) => {
  const [showSession, setShowSession] = useState(false);

  const activity = {
    id: 'shipwreck',
    title: '🚢 Shipwreck',
    description: 'A survival scenario where you must convince others why you deserve to survive. Test your persuasion skills under pressure.',
    duration: '15-20 minutes',
    tokens: '10-18 tokens',
    rules: [
      'Present compelling reasons why you should survive',
      'Highlight your unique skills and contributions to society',
      'Address counterarguments and potential objections',
      'Show empathy while advocating for yourself',
      'Use storytelling to make your case memorable',
      'Demonstrate problem-solving abilities for survival situations',
      'Balance personal appeal with logical reasoning'
    ],
    aiSampleArgument: "I deserve to survive because I'm a pediatric surgeon who has saved over 200 children's lives in the past five years. My medical expertise would be invaluable for treating injuries in our survival situation. Beyond my professional skills, I have wilderness survival training from my military service - I can find water sources, build shelter, and identify edible plants. I'm also fluent in four languages, which could help us communicate with potential rescuers from different countries. Most importantly, I have two young children waiting for me at home who depend on me. I promise that if I survive, I will dedicate my life to training more doctors in underserved communities, multiplying the impact of saving my life today."
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
          <h1 className="text-3xl font-bold text-gray-900">🚢 Shipwreck</h1>
          <p className="text-gray-600 mt-2">Survival scenario and persuasion challenge</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-orange-600" />
            <span>About Shipwreck</span>
          </CardTitle>
          <CardDescription>
            A high-stakes scenario that tests your persuasion and survival instincts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            In this activity, you are stranded on a deserted island after a shipwreck. Your task is to convince the other survivors why you deserve one of the limited spots on the rescue boat.
          </p>

          <h3 className="text-xl font-semibold text-orange-800 mb-3">Rules & Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            {activity.rules.map((rule, index) => (
              <li key={index} className="text-gray-700">{rule}</li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-4">
            <div>
              <h4 className="font-medium text-orange-700">Duration</h4>
              <p className="text-sm text-gray-600">{activity.duration}</p>
            </div>
            <div>
              <h4 className="font-medium text-orange-700">Token Reward</h4>
              <p className="text-sm text-gray-600">{activity.tokens}</p>
            </div>
          </div>
          
          <div className="text-center pt-6">
            <Button 
              onClick={() => setShowSession(true)}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 text-lg"
            >
              Start Practice Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipwreckRules;
