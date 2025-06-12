
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Crown, Clock, Target, Zap } from 'lucide-react';
import GroupDiscussionRules from './activities/GroupDiscussionRules';
import BestManagerRules from './activities/BestManagerRules';
import JAMRules from './activities/JAMRules';
import ShipwreckRules from './activities/ShipwreckRules';
import AdzapRules from './activities/AdzapRules';

interface PublicSpeakingActivitiesProps {
  onBack: () => void;
}

const PublicSpeakingActivities = ({ onBack }: PublicSpeakingActivitiesProps) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const activities = [
    {
      id: 'group-discussion',
      title: '🗣️ Group Discussion',
      description: 'Collaborative discussion on current topics with multiple participants',
      participants: '6-8 people',
      duration: '15-20 minutes',
      difficulty: 'Medium',
      tokens: '8-15',
      icon: Users,
      color: 'bg-blue-500',
      borderColor: 'border-blue-200',
      bgGradient: 'from-blue-50 to-white'
    },
    {
      id: 'best-manager',
      title: '👔 Best Manager',
      description: 'Business simulation where you solve corporate challenges',
      participants: '4-6 people',
      duration: '20-25 minutes',
      difficulty: 'Hard',
      tokens: '12-20',
      icon: Crown,
      color: 'bg-purple-500',
      borderColor: 'border-purple-200',
      bgGradient: 'from-purple-50 to-white'
    },
    {
      id: 'jam',
      title: '⚡ JAM (Just A Minute)',
      description: 'Speak for exactly one minute on any given topic without repetition',
      participants: '3-5 people',
      duration: '10-15 minutes',
      difficulty: 'Medium',
      tokens: '6-12',
      icon: Clock,
      color: 'bg-green-500',
      borderColor: 'border-green-200',
      bgGradient: 'from-green-50 to-white'
    },
    {
      id: 'shipwreck',
      title: '🚢 Shipwreck',
      description: 'Survival scenario where you convince others why you deserve to survive',
      participants: '5-8 people',
      duration: '15-20 minutes',
      difficulty: 'Hard',
      tokens: '10-18',
      icon: Target,
      color: 'bg-orange-500',
      borderColor: 'border-orange-200',
      bgGradient: 'from-orange-50 to-white'
    },
    {
      id: 'adzap',
      title: '📺 AdZap',
      description: 'Create and present creative advertisements for products or services',
      participants: '4-6 people',
      duration: '15-20 minutes',
      difficulty: 'Medium',
      tokens: '8-15',
      icon: Zap,
      color: 'bg-indigo-500',
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white'
    }
  ];

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
  };

  if (selectedActivity) {
    switch (selectedActivity) {
      case 'group-discussion':
        return <GroupDiscussionRules onBack={handleBackToActivities} />;
      case 'best-manager':
        return <BestManagerRules onBack={handleBackToActivities} />;
      case 'jam':
        return <JAMRules onBack={handleBackToActivities} />;
      case 'shipwreck':
        return <ShipwreckRules onBack={handleBackToActivities} />;
      case 'adzap':
        return <AdzapRules onBack={handleBackToActivities} />;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎭 Public Speaking Activities</h1>
          <p className="text-gray-600 mt-2">Enhance your communication skills through interactive group activities</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card 
            key={activity.id}
            className={`card-shadow-lg border-2 ${activity.borderColor} bg-gradient-to-br ${activity.bgGradient} hover:shadow-xl transition-all cursor-pointer`}
            onClick={() => handleActivitySelect(activity.id)}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto ${activity.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
                <activity.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">{activity.title}</CardTitle>
              <CardDescription className="text-sm">
                {activity.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Participants</span>
                <Badge variant="outline">{activity.participants}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Duration</span>
                <Badge variant="outline">{activity.duration}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Difficulty</span>
                <Badge 
                  className={
                    activity.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    activity.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }
                >
                  {activity.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Token Reward</span>
                <Badge className="bg-yellow-100 text-yellow-700">
                  {activity.tokens} tokens
                </Badge>
              </div>
              <Button className="w-full mt-4">
                View Rules & Start
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="card-shadow border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-green-600" />
            <span>Benefits of Public Speaking Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <Users className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium">Team Collaboration</h4>
              <p className="text-sm text-gray-600">Learn to work effectively in groups</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <Crown className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium">Leadership Skills</h4>
              <p className="text-sm text-gray-600">Develop confidence and authority</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <Clock className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium">Quick Thinking</h4>
              <p className="text-sm text-gray-600">Improve spontaneous speaking</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-lg mb-2">
                <Zap className="h-6 w-6 text-orange-600 mx-auto" />
              </div>
              <h4 className="font-medium">Creative Expression</h4>
              <p className="text-sm text-gray-600">Enhance presentation skills</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicSpeakingActivities;
