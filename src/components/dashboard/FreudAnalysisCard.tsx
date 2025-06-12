
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

const FreudAnalysisCard = () => {
  const skillProgress = [
    { skill: 'Id (Instinctive)', level: 75, color: 'bg-red-500', description: 'Aggressive/Impulsive arguments' },
    { skill: 'Ego (Rational)', level: 88, color: 'bg-blue-500', description: 'Structure & Logic' },
    { skill: 'Superego (Moral)', level: 62, color: 'bg-green-500', description: 'Ethics & Empathy' },
  ];

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Freud Theory Analysis</span>
        </CardTitle>
        <CardDescription>Your debate personality based on Freud's theory</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skillProgress.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                <p className="text-xs text-gray-500">{skill.description}</p>
              </div>
              <span className="text-sm text-gray-500">{skill.level}/10</span>
            </div>
            <Progress value={skill.level * 10} className="h-2" />
          </div>
        ))}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700">Latest Summary:</p>
          <p className="text-sm text-gray-600">"Strong ego and logic, work on empathy and moral arguments"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreudAnalysisCard;
