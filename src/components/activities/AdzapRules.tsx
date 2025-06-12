import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Zap } from 'lucide-react';
import PublicSpeakingSession from './PublicSpeakingSession';

interface AdzapRulesProps {
  onBack: () => void;
}

const AdzapRules = ({ onBack }: AdzapRulesProps) => {
  const [showSession, setShowSession] = useState(false);

  const activity = {
    id: 'adzap',
    title: '📺 AdZap',
    description: 'Create and present creative advertisements for products or services. Showcase your marketing creativity and presentation skills.',
    duration: '15-20 minutes',
    tokens: '8-15 tokens',
    rules: [
      'Create an original advertisement concept',
      'Identify target audience and their needs',
      'Use persuasive language and compelling visuals (describe them)',
      'Include a memorable tagline or slogan',
      'Address potential customer objections',
      'Demonstrate the product benefits clearly',
      'End with a strong call-to-action'
    ],
    aiSampleArgument: "Introducing EcoClean - the revolutionary cleaning spray that's tough on stains but gentle on the planet! Picture this: a busy mother of three discovers a mysterious stain on her white sofa just minutes before guests arrive. She sprays EcoClean, and within seconds, the stain vanishes completely. What makes EcoClean different? It's made from 100% biodegradable ingredients, safe for children and pets, yet powerful enough to tackle the toughest stains. Our customers report 95% satisfaction rates, and we offer a money-back guarantee. For just $12.99, you get 500ml of cleaning power that lasts three times longer than leading brands. EcoClean - where effectiveness meets environmental responsibility. Order now and get free shipping! Clean conscience, cleaner home."
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
          <h1 className="text-3xl font-bold text-gray-900">📺 AdZap</h1>
          <p className="text-gray-600 mt-2">Creative advertising and marketing challenge</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-indigo-600" />
            <span>About AdZap</span>
          </CardTitle>
          <CardDescription>
            Unleash your creativity and marketing prowess through advertisement creation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-800">Rules & Guidelines</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {activity.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-800">Format</h3>
            <p className="text-gray-700">
              Participants will have 15-20 minutes to create and present an advertisement for a given product or service.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Duration</span>
              <Badge variant="outline">{activity.duration}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Token Reward</span>
              <Badge className="bg-yellow-100 text-yellow-700">{activity.tokens}</Badge>
            </div>
          </div>
          
          <div className="text-center pt-6">
            <Button 
              onClick={() => setShowSession(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-lg"
            >
              Start Practice Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdzapRules;
