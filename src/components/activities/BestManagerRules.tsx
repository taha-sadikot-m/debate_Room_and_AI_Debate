import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Crown } from 'lucide-react';
import PublicSpeakingSession from './PublicSpeakingSession';

interface BestManagerRulesProps {
  onBack: () => void;
}

const BestManagerRules = ({ onBack }: BestManagerRulesProps) => {
  const [showSession, setShowSession] = useState(false);

  const activity = {
    id: 'best-manager',
    title: '👔 Best Manager',
    description: 'Step into the shoes of a business leader and solve complex corporate challenges through strategic thinking and leadership skills.',
    duration: '20-25 minutes',
    tokens: '12-20 tokens',
    rules: [
      'Analyze the business scenario thoroughly before proposing solutions',
      'Consider multiple stakeholders - employees, customers, shareholders',
      'Present data-driven arguments with realistic timelines',
      'Address potential risks and mitigation strategies',
      'Demonstrate leadership qualities and decision-making skills',
      'Show understanding of market dynamics and competition',
      'Present a clear implementation plan with measurable outcomes'
    ],
    aiSampleArgument: "As the new CEO of a struggling retail chain, I would implement a three-phase digital transformation strategy. Phase one focuses on e-commerce infrastructure - our online sales represent only 15% of revenue compared to industry average of 35%. We'll invest $2 million over six months to upgrade our platform and logistics. Phase two involves employee retraining - 70% of our workforce needs digital skills development. This isn't just about technology; it's about preserving jobs while adapting to market realities. Phase three targets customer experience through omnichannel integration, potentially increasing customer lifetime value by 25% based on similar transformations in our sector."
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
          <h1 className="text-3xl font-bold text-gray-900">👔 Best Manager</h1>
          <p className="text-gray-600 mt-2">Business simulation and leadership challenge</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-purple-600" />
            <span>About Best Manager</span>
          </CardTitle>
          <CardDescription>
            Test your leadership and business acumen through real-world corporate scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            In this activity, you'll step into the role of a business leader facing critical decisions.
            Your goal is to analyze the situation, propose innovative solutions, and demonstrate
            effective leadership skills.
          </p>

          <h3 className="text-xl font-semibold text-purple-800">Rules & Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {activity.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold text-purple-800">Format</h3>
          <p className="text-gray-700">
            You'll be given a business scenario with specific challenges. You'll have a limited time
            to analyze the situation, develop a strategic plan, and present your solutions to a panel
            of judges (simulated by AI).
          </p>
          
          <div className="text-center pt-6">
            <Button 
              onClick={() => setShowSession(true)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
            >
              Start Practice Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BestManagerRules;
