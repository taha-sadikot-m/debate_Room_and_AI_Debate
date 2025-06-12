
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Anchor, Users, Clock, Waves } from 'lucide-react';

interface ShipwreckRulesProps {
  onBack: () => void;
}

const ShipwreckRules = ({ onBack }: ShipwreckRulesProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚢 Shipwreck Rules</h1>
          <p className="text-gray-600 mt-2">Survival scenario where you must convince others why you deserve to survive</p>
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
              <Anchor className="h-6 w-6 text-orange-600" />
              <span>Game Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Shipwreck is a survival-based role-playing activity where participants are stranded 
              on a sinking ship or deserted island. Each participant plays a character with a specific 
              profession and must convince the group why they are most essential for survival and 
              deserve a spot in the limited rescue boat.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Participants</h4>
                <Badge variant="outline">5-8 people</Badge>
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
              <div className="bg-orange-100 p-4 rounded-lg mb-2">
                <Waves className="h-8 w-8 text-orange-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Difficulty Level</p>
                <Badge className="bg-red-100 text-red-700">Hard</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-lg mb-2">
                <Anchor className="h-8 w-8 text-yellow-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Token Reward</p>
                <Badge className="bg-yellow-100 text-yellow-700">10-18 tokens</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Setup */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            <Waves className="h-6 w-6" />
            <span>The Scenario</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">
              "Your luxury cruise ship has hit an iceberg and is sinking rapidly. There is only one 
              lifeboat available that can accommodate 4 people safely. With 8 passengers on board, 
              you must decide who gets to survive. Each passenger will present their case for why 
              they deserve a spot in the lifeboat."
            </p>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Critical Constraints:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Lifeboat capacity: 4 people maximum</li>
                <li>• Rescue arrival: 48-72 hours</li>
                <li>• Limited supplies: Basic food and water for 2 days</li>
                <li>• Weather conditions: Storm approaching</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Roles */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Sample Character Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <h4 className="font-semibold">Ship's Captain (55)</h4>
                <p className="text-sm text-gray-600">Expert navigator with 30 years experience, knows survival techniques</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <h4 className="font-semibold">Doctor (40)</h4>
                <p className="text-sm text-gray-600">Emergency medicine specialist, can treat injuries and illnesses</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3">
                <h4 className="font-semibold">Pregnant Woman (28)</h4>
                <p className="text-sm text-gray-600">7 months pregnant, teacher, represents future life</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-3">
                <h4 className="font-semibold">Engineer (35)</h4>
                <p className="text-sm text-gray-600">Can repair radio equipment and mechanical devices</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-3">
                <h4 className="font-semibold">Child (12)</h4>
                <p className="text-sm text-gray-600">Unaccompanied minor, whole life ahead, innocent</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3">
                <h4 className="font-semibold">Chef (45)</h4>
                <p className="text-sm text-gray-600">Expert in food preparation and rationing, survival cooking</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-3">
                <h4 className="font-semibold">Athlete (25)</h4>
                <p className="text-sm text-gray-600">Olympic swimmer, physically strong, can help with rescue operations</p>
              </div>
              <div className="border-l-4 border-pink-500 pl-3">
                <h4 className="font-semibold">Elderly Professor (70)</h4>
                <p className="text-sm text-gray-600">Retired marine biologist, knows ocean currents and weather patterns</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Structure */}
      <Card>
        <CardHeader>
          <CardTitle>⏱️ Game Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <Clock className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium">Role Assignment</h4>
              <p className="text-sm text-gray-600">Each participant receives a character profile (2 minutes)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <Users className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium">Preparation</h4>
              <p className="text-sm text-gray-600">Develop survival arguments and character backstory (3 minutes)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <Anchor className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium">Presentations</h4>
              <p className="text-sm text-gray-600">Each character pleads their case (1.5 minutes each)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-orange-100 p-3 rounded-lg mb-2">
                <Waves className="h-6 w-6 text-orange-600 mx-auto" />
              </div>
              <h4 className="font-medium">Decision</h4>
              <p className="text-sm text-gray-600">Group discussion and final survival selection (5 minutes)</p>
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
                <Users className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Persuasion Skills</h4>
              <p className="text-sm text-gray-600">Ability to convince others through logical arguments</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-3">
                <Anchor className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Character Portrayal</h4>
              <p className="text-sm text-gray-600">Authentic representation of assigned role</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-3">
                <Clock className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Quick Thinking</h4>
              <p className="text-sm text-gray-600">Adaptability and response to challenges</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-lg mb-3">
                <Waves className="h-6 w-6 text-orange-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Emotional Impact</h4>
              <p className="text-sm text-gray-600">Creating genuine emotional connection with audience</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Survival Strategy Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Effective Arguments</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Highlight unique skills essential for survival</li>
                <li>• Emphasize your value to the group's survival</li>
                <li>• Appeal to both logic and emotion</li>
                <li>• Consider long-term survival needs</li>
                <li>• Show willingness to sacrifice for others</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Character Development</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create a compelling backstory</li>
                <li>• Show genuine fear and desperation</li>
                <li>• Demonstrate your character's humanity</li>
                <li>• Use specific examples of your expertise</li>
                <li>• Connect with other characters' situations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="bg-orange-500 hover:bg-orange-600" size="lg">
          <Anchor className="h-5 w-5 mr-2" />
          Start Shipwreck Survival
        </Button>
      </div>
    </div>
  );
};

export default ShipwreckRules;
