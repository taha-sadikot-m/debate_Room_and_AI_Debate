
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import PublicSpeakingSession from './PublicSpeakingSession';

interface AdzapRulesProps {
  onBack: () => void;
}

const AdzapRules = ({ onBack }: AdzapRulesProps) => {
  const [showSession, setShowSession] = useState(false);

  const activity = {
    id: 'adzap',
    title: '📢 Ad-Zap',
    description: 'Create compelling advertisements for products on the spot. Showcase your creativity and persuasion skills.',
    duration: '8-12 minutes',
    tokens: '10-18 tokens',
    rules: [
      'Create an advertisement for a given product in 2-3 minutes',
      'Include key selling points and target audience appeal',
      'Use persuasive language and emotional triggers',
      'Be creative with presentation style and format',
      'Address potential customer objections',
      'Include a strong call-to-action',
      'Stay within time limits for maximum impact'
    ],
    aiSampleArgument: "Introducing EcoClean - the revolutionary cleaning solution that's changing homes across India! Made from 100% natural ingredients, EcoClean doesn't just clean your surfaces - it protects your family's health. While chemical cleaners leave toxic residues, EcoClean uses the power of neem and tulsi to eliminate 99.9% of germs naturally. Perfect for families with children and pets. Join over 50,000 satisfied customers who've made the switch. Available now at your local store for just ₹199. EcoClean - Clean homes, healthy families, better tomorrow!"
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
          <h1 className="text-3xl font-bold text-gray-900">📢 Ad-Zap</h1>
          <p className="text-gray-600 mt-2">Creative advertising challenge</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            <span>About Ad-Zap</span>
          </CardTitle>
          <CardDescription>
            Test your creative and persuasive skills by creating compelling advertisements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-800">Rules & Guidelines</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {activity.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-800">Format</h3>
            <p className="text-gray-700">
              Create an engaging advertisement that captures attention and persuades the audience.
              Focus on benefits, emotional appeal, and clear call-to-action.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-orange-100 text-orange-700">Creative Presentation</Badge>
              <Badge className="bg-orange-100 text-orange-700">Persuasive Content</Badge>
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

export default AdzapRules;
