
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Briefcase, Target, TrendingUp } from 'lucide-react';

interface BestManagerRulesProps {
  onBack: () => void;
}

const BestManagerRules = ({ onBack }: BestManagerRulesProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👔 Best Manager Rules</h1>
          <p className="text-gray-600 mt-2">Business simulation and management challenge</p>
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
              <Crown className="h-6 w-6 text-purple-600" />
              <span>Game Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Best Manager is a business simulation activity where participants are presented with 
              real-world corporate scenarios. Each participant takes on the role of a manager and 
              must present their solution, strategy, and implementation plan to solve the given challenge.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Participants</h4>
                <Badge variant="outline">4-6 people</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Duration</h4>
                <Badge variant="outline">20-25 minutes</Badge>
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
              <div className="bg-purple-100 p-4 rounded-lg mb-2">
                <Target className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Difficulty Level</p>
                <Badge className="bg-red-100 text-red-700">Hard</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-lg mb-2">
                <Crown className="h-8 w-8 text-yellow-600 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Token Reward</p>
                <Badge className="bg-yellow-100 text-yellow-700">12-20 tokens</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Structure */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Game Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-medium">Scenario Presentation</h4>
              <p className="text-sm text-gray-600">Business case is presented (3-5 minutes)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-medium">Preparation Time</h4>
              <p className="text-sm text-gray-600">Individual strategy planning (5 minutes)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-medium">Presentations</h4>
              <p className="text-sm text-gray-600">Each participant presents solution (2-3 min each)</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-orange-100 p-3 rounded-lg mb-2">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <h4 className="font-medium">Q&A Round</h4>
              <p className="text-sm text-gray-600">Cross-questioning and discussion (5-7 minutes)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-3">
                <Briefcase className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Business Acumen</h4>
              <p className="text-sm text-gray-600">Understanding of business concepts and market dynamics</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-3">
                <Target className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Problem-Solving</h4>
              <p className="text-sm text-gray-600">Creative and practical solutions to challenges</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-3">
                <Crown className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Leadership</h4>
              <p className="text-sm text-gray-600">Confidence, decision-making, and communication</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-lg mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto" />
              </div>
              <h4 className="font-medium mb-2">Implementation</h4>
              <p className="text-sm text-gray-600">Feasibility and timeline of proposed solutions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>💼 Sample Business Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Market Entry Challenge</h4>
              <p className="text-sm text-gray-600">Your company wants to enter a new international market. Design an entry strategy considering cultural, legal, and competitive factors.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">Crisis Management</h4>
              <p className="text-sm text-gray-600">A product recall has damaged your brand reputation. Develop a comprehensive crisis management and brand recovery plan.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">Digital Transformation</h4>
              <p className="text-sm text-gray-600">Lead the digital transformation of a traditional retail business to compete with e-commerce giants.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold">Talent Retention</h4>
              <p className="text-sm text-gray-600">High employee turnover is affecting productivity. Create a comprehensive talent retention and engagement strategy.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="bg-purple-500 hover:bg-purple-600" size="lg">
          <Crown className="h-5 w-5 mr-2" />
          Start Best Manager Challenge
        </Button>
      </div>
    </div>
  );
};

export default BestManagerRules;
