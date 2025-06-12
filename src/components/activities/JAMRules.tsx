import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import PublicSpeakingSession from './PublicSpeakingSession';

interface JAMRulesProps {
  onBack: () => void;
}

const JAMRules = ({ onBack }: JAMRulesProps) => {
  const [showSession, setShowSession] = useState(false);

  const activity = {
    id: 'jam',
    title: '⚡ JAM (Just A Minute)',
    description: 'Speak for exactly one minute on any given topic without repetition, hesitation, or deviation from the subject.',
    duration: '10-15 minutes',
    tokens: '6-12 tokens',
    rules: [
      'Speak for exactly 60 seconds without stopping',
      'Avoid repetition of words, phrases, or ideas',
      'No hesitation - maintain steady flow of speech',
      'Stay relevant to the given topic throughout',
      'Use varied vocabulary and sentence structures',
      'Think quickly and transition smoothly between points',
      'End exactly at the one-minute mark for maximum points'
    ],
    aiSampleArgument: "Leadership in the modern world requires adaptability above all else. Today's leaders navigate unprecedented challenges - from technological disruption to global pandemics, each demanding swift decision-making under uncertainty. Effective leaders cultivate emotional intelligence, understanding that managing people involves empathy, communication, and trust-building. They embrace continuous learning, recognizing that yesterday's solutions may not address tomorrow's problems. Great leaders also demonstrate vulnerability - admitting mistakes, seeking feedback, and empowering their teams to innovate. The most successful leaders I've observed combine strategic thinking with tactical execution, maintaining long-term vision while addressing immediate concerns. Ultimately, leadership is about inspiring others to achieve collective goals that seemed impossible individually."
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
          <h1 className="text-3xl font-bold text-gray-900">⚡ JAM (Just A Minute)</h1>
          <p className="text-gray-600 mt-2">Rapid-fire speaking challenge</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-green-600" />
            <span>About JAM</span>
          </CardTitle>
          <CardDescription>
            Test your quick thinking and speaking skills with this classic challenge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-800">Rules & Guidelines</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {activity.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-800">Format</h3>
            <p className="text-gray-700">
              Participants are given a random topic and must speak for one minute without any
              pauses, repetitions, or deviations from the subject.
            </p>
          </div>
          
          <div className="text-center pt-6">
            <Button 
              onClick={() => setShowSession(true)}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              Start Practice Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JAMRules;
