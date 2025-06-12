
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Globe, Users, MessageSquare } from 'lucide-react';

interface ForeignPolicyLearningProps {
  onBack: () => void;
}

const ForeignPolicyLearning = ({ onBack }: ForeignPolicyLearningProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showPosition, setShowPosition] = useState(false);

  const countries = [
    { id: 'usa', name: 'United States', bloc: 'Western Bloc' },
    { id: 'china', name: 'China', bloc: 'Eastern Bloc' },
    { id: 'eu', name: 'European Union', bloc: 'Western Bloc' },
    { id: 'russia', name: 'Russian Federation', bloc: 'Eastern Bloc' },
    { id: 'india', name: 'India', bloc: 'Non-Aligned' },
    { id: 'brics', name: 'BRICS', bloc: 'Emerging Economies' },
    { id: 'gcc', name: 'Gulf Cooperation Council', bloc: 'Middle East' },
    { id: 'au', name: 'African Union', bloc: 'African Bloc' },
  ];

  const topics = [
    { id: 'israel-palestine', name: 'Israel-Palestine Conflict' },
    { id: 'ai-regulation', name: 'AI Regulation and Ethics' },
    { id: 'climate-change', name: 'Climate Change Action' },
    { id: 'trade-wars', name: 'Global Trade Relations' },
    { id: 'nuclear-proliferation', name: 'Nuclear Non-Proliferation' },
    { id: 'cyber-security', name: 'Cybersecurity Governance' },
  ];

  const generatePosition = () => {
    if (selectedCountry && selectedTopic) {
      setShowPosition(true);
    }
  };

  const samplePosition = {
    arguments_for: [
      "Economic stability requires sustained international cooperation",
      "Regional security benefits from multilateral diplomatic engagement",
      "Technology sharing accelerates global development goals"
    ],
    arguments_against: [
      "National sovereignty must be preserved in bilateral negotiations",
      "Domestic priorities should take precedence over international commitments",
      "Economic dependencies can compromise strategic autonomy"
    ],
    neutral_pathway: "Establish a phased approach with conditional agreements that allow for flexibility while maintaining core national interests and regional stability."
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎓 Foreign Policy Learning</h1>
          <p className="text-gray-600 mt-2">Learn country positions and bloc strategies</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>Select Country/Bloc</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a country or bloc" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{country.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {country.bloc}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>Select Topic</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a policy topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={generatePosition}
          disabled={!selectedCountry || !selectedTopic}
          className="gradient-indigo text-white"
          size="lg"
        >
          Generate AI Foreign Policy Position
        </Button>
      </div>

      {showPosition && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-shadow border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Arguments For</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {samplePosition.arguments_for.map((arg, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {arg}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="card-shadow border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Arguments Against</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {samplePosition.arguments_against.map((arg, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {arg}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="card-shadow border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Neutral/Negotiation Pathway</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{samplePosition.neutral_pathway}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="card-shadow bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span>Debate Practice Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Practice debating with AI opponents representing different country perspectives
          </p>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            Start Practice Debate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForeignPolicyLearning;
