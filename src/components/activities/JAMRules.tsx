
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Zap, Target, AlertCircle }from 'lucide-react';

interface JAMRulesProps {
  onBack: () => void;
}

const JAMRules = ({ onBack }: JAMRulesProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚡ JAM (Just A Minute) Rules</h1>
          <p className="text-gray-600 mt-2">Speak for exactly one minute without hesitation, repetition, or deviation</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-green-600" />
              <span>Game Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              JAM (Just A Minute) is a spontaneous speaking activity where participants must speak 
              continuously for exactly one minute on a given topic without hesitation, repetition, 
              or deviation from the subject. It tests quick thinking, vocabulary, and fluency.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Participants</h4>
                <Badge variant="outline">3-5 people</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Duration</h4>
                <Badge variant="outline">10-15 minutes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Activity Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-2">
                <Target className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Difficulty Level</p>
                <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-lg mb-2">
                <Zap className="h-8 w-8 text-yellow-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Token Reward</p>
                <Badge className="bg-yellow-100 text-yellow-700">6-12 tokens</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The Three Cardinal Rules */}
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <span>The Three Cardinal Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <div className="bg-red-100 p-3 rounded-lg mb-3">
                <span className="text-red-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-red-700 mb-2">No Hesitation</h4>
              <p className="text-sm text-gray-700">Avoid long pauses, "umm", "ahh", or stammering. Keep the flow continuous.</p>
            </div>
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <div className="bg-red-100 p-3 rounded-lg mb-3">
                <span className="text-red-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-red-700 mb-2">No Repetition</h4>
              <p className="text-sm text-gray-700">Don't repeat the same word or phrase unnecessarily within your minute.</p>
            </div>
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <div className="bg-red-100 p-3 rounded-lg mb-3">
                <span className="text-red-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-red-700 mb-2">No Deviation</h4>
              <p className="text-sm text-gray-700">Stay strictly on the given topic. Don't wander off to unrelated subjects.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Flow */}
      <Card>
        <CardHeader>
          <CardTitle>🎮 Game Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Topic Announcement</h4>
                <p className="text-sm text-gray-600">Moderator announces a random topic</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Quick Thinking (5 seconds)</h4>
                <p className="text-sm text-gray-600">Participant gets 5 seconds to organize thoughts</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-purple-100 p-2 rounded-full">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Speaking Time (60 seconds)</h4>
                <p className="text-sm text-gray-600">Participant speaks continuously for exactly one minute</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-orange-100 p-2 rounded-full">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Evaluation</h4>
                <p className="text-sm text-gray-600">Performance is evaluated based on adherence to rules and content quality</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Topics */}
      <Card>
        <CardHeader>
          <CardTitle>💭 Sample JAM Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Abstract Concepts</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Time</li>
                <li>• Happiness</li>
                <li>• Dreams</li>
                <li>• Silence</li>
                <li>• Perfection</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Everyday Objects</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Umbrella</li>
                <li>• Mirror</li>
                <li>• Pen</li>
                <li>• Clock</li>
                <li>• Shoes</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">Experiences</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• First day at school</li>
                <li>• Monsoon</li>
                <li>• Cooking</li>
                <li>• Traffic jams</li>
                <li>• Birthdays</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Success */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Preparation Strategies</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Think of multiple angles to approach the topic</li>
                <li>• Have personal experiences ready to share</li>
                <li>• Practice transitioning between different aspects</li>
                <li>• Build a mental library of connecting phrases</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">During Speaking</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Start with a strong opening statement</li>
                <li>• Use storytelling to fill time naturally</li>
                <li>• Vary your sentence structure and pace</li>
                <li>• End with a memorable conclusion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="bg-green-500 hover:bg-green-600" size="lg">
          <Clock className="h-5 w-5 mr-2" />
          Start JAM Session
        </Button>
      </div>
    </div>
  );
};

export default JAMRules;
