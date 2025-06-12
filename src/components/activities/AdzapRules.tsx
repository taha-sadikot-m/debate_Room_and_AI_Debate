
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Target, Users, Lightbulb } from 'lucide-react';

interface AdzapRulesProps {
  onBack: () => void;
}

const AdzapRules = ({ onBack }: AdzapRulesProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📺 AdZap Rules</h1>
          <p className="text-gray-600 mt-2">Create and present creative advertisements for products or services</p>
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
              <Zap className="h-6 w-6 text-indigo-600" />
              <span>Game Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              AdZap is a creative advertising challenge where participants or teams are given a product, 
              service, or concept and must create an innovative advertisement. The goal is to develop 
              a compelling marketing campaign that captures attention, communicates the value proposition, 
              and persuades the target audience.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Participants</h4>
                <Badge variant="outline">4-6 people</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Duration</h4>
                <Badge variant="outline">15-20 minutes</Badge>
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
              <div className="bg-indigo-100 p-4 rounded-lg mb-2">
                <Target className="h-8 w-8 text-indigo-600 mx-auto" />
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
                <Badge className="bg-yellow-100 text-yellow-700">8-15 tokens</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Structure */}
      <Card>
        <CardHeader>
          <CardTitle>🎬 Game Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-medium">Product Assignment</h4>
              <p className="text-sm text-gray-600">Random product/service is assigned (1 minute)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-medium">Brainstorming</h4>
              <p className="text-sm text-gray-600">Develop creative concept and script (5-7 minutes)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-medium">Ad Presentation</h4>
              <p className="text-sm text-gray-600">Perform the advertisement (2-3 minutes each)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-orange-100 p-3 rounded-lg mb-2">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <h4 className="font-medium">Feedback Round</h4>
              <p className="text-sm text-gray-600">Audience questions and critique (3-5 minutes)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Components */}
      <Card>
        <CardHeader>
          <CardTitle>🧩 Essential Ad Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <Lightbulb className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-center">Hook/Attention Grabber</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Catchy opening line</li>
                <li>• Visual/audio element</li>
                <li>• Unexpected scenario</li>
                <li>• Problem presentation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <Target className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-center">Product Showcase</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Key features highlight</li>
                <li>• Benefits demonstration</li>
                <li>• Unique selling proposition</li>
                <li>• Problem solution</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <Zap className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-center">Call to Action</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clear next step</li>
                <li>• Urgency creation</li>
                <li>• Contact information</li>
                <li>• Memorable tagline</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Products */}
      <Card>
        <CardHeader>
          <CardTitle>🛍️ Sample Products & Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Everyday Products</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Anti-gravity umbrella</li>
                <li>• Self-stirring coffee mug</li>
                <li>• Edible mobile phone covers</li>
                <li>• Mood-changing shoes</li>
                <li>• Invisible socks</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Services</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Professional queue-standing service</li>
                <li>• Dream interpretation consultancy</li>
                <li>• Pet emotion counseling</li>
                <li>• Virtual reality dating</li>
                <li>• Procrastination coaching</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">Concepts</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Artificial Intelligence for pets</li>
                <li>• Time-travel insurance</li>
                <li>• Happiness subscription box</li>
                <li>• Noise-canceling hairband</li>
                <li>• Calories-burning pillow</li>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Creativity</h4>
              <p className="text-sm text-gray-600">Original ideas and innovative approach</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-3">
                <Target className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Persuasiveness</h4>
              <p className="text-sm text-gray-600">Ability to convince and influence audience</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-3">
                <Users className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Presentation</h4>
              <p className="text-sm text-gray-600">Delivery, confidence, and engagement</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-lg mb-3">
                <Zap className="h-6 w-6 text-orange-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Entertainment</h4>
              <p className="text-sm text-gray-600">Humor, memorability, and audience reaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creative Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Creative Strategy Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Concept Development</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Identify the core benefit of your product</li>
                <li>• Think about your target audience</li>
                <li>• Create a relatable problem-solution narrative</li>
                <li>• Use humor, emotion, or surprise elements</li>
                <li>• Make it memorable with a catchy jingle or slogan</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Presentation Excellence</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use props or visual aids when possible</li>
                <li>• Vary voice tone and pace for impact</li>
                <li>• Engage the audience directly</li>
                <li>• Include a demonstration if applicable</li>
                <li>• End with a strong, memorable call to action</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="bg-indigo-500 hover:bg-indigo-600" size="lg">
          <Zap className="h-5 w-5 mr-2" />
          Start AdZap Challenge
        </Button>
      </div>
    </div>
  );
};

export default AdzapRules;
