
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, Target, CheckCircle } from 'lucide-react';

interface GroupDiscussionRulesProps {
  onBack: () => void;
}

const GroupDiscussionRules = ({ onBack }: GroupDiscussionRulesProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🗣️ Group Discussion Rules</h1>
          <p className="text-gray-600 mt-2">Collaborative discussion format for multiple participants</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span>Game Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Group Discussion is a structured conversation where participants discuss a given topic, 
              sharing their views, ideas, and perspectives. It's designed to test communication skills, 
              leadership qualities, team spirit, and knowledge on various subjects.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Participants</h4>
                <Badge variant="outline">6-8 people</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Duration</h4>
                <Badge variant="outline">15-20 minutes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Activity Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-2">
                <Target className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Difficulty Level</p>
                <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-2">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Token Reward</p>
                <Badge className="bg-yellow-100 text-yellow-700">8-15 tokens</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Rules & Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">✅ Do's</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Listen actively to other participants</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Speak clearly and at moderate pace</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support your points with facts and examples</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Maintain eye contact with participants</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Be respectful of different opinions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Take initiative to start or guide discussion</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-red-600">❌ Don'ts</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span>Interrupt others while speaking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span>Make personal attacks or offensive remarks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span>Dominate the entire conversation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span>Remain completely silent throughout</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span>Speak without logical flow or structure</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span>Use inappropriate language or tone</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-3">
                <Users className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Communication Skills</h4>
              <p className="text-sm text-gray-600">Clarity, fluency, and articulation of ideas</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-3">
                <Target className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Content Quality</h4>
              <p className="text-sm text-gray-600">Relevance, depth, and factual accuracy</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Team Dynamics</h4>
              <p className="text-sm text-gray-600">Leadership, cooperation, and listening skills</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Topics */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Sample Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Technology & Society</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Impact of AI on job market</li>
                <li>• Social media and mental health</li>
                <li>• Digital privacy vs convenience</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Environment & Sustainability</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Climate change solutions</li>
                <li>• Sustainable development goals</li>
                <li>• Renewable energy adoption</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="bg-blue-500 hover:bg-blue-600" size="lg">
          <Users className="h-5 w-5 mr-2" />
          Start Group Discussion
        </Button>
      </div>
    </div>
  );
};

export default GroupDiscussionRules;
