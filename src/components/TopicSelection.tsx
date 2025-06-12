
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  ArrowRight,
  Shuffle,
  Clock,
  Users
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface TopicSelectionProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onTopicSelect: (topic: Topic) => void;
  onBack: () => void;
}

const TopicSelection = ({ difficulty, theme, onTopicSelect, onBack }: TopicSelectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showArguments, setShowArguments] = useState(false);

  const allTopics: Topic[] = [
    // Technology Topics
    {
      id: 'tech-1',
      title: "Should AI replace human teachers in schools?",
      description: "Debate the role of artificial intelligence in education",
      difficulty: 'Medium',
      category: 'Education Technology',
      timeEstimate: '12-15 min',
      theme: 'Technology',
      aiArguments: {
        pro: [
          "AI can provide personalized learning at scale for every student",
          "AI teachers are available 24/7 and never get tired or frustrated",
          "AI can instantly adapt to different learning styles and speeds"
        ],
        con: [
          "Human emotional connection is crucial for student development",
          "Teachers provide mentorship and life guidance beyond academics",
          "AI lacks creativity and cannot inspire students like humans can"
        ]
      }
    },
    {
      id: 'tech-2',
      title: "Should social media platforms ban political advertisements?",
      description: "Examine the impact of political ads on democratic processes",
      difficulty: 'Hard',
      category: 'Digital Democracy',
      timeEstimate: '15-20 min',
      theme: 'Technology',
      aiArguments: {
        pro: [
          "Political ads spread misinformation and manipulate voters",
          "Wealthy candidates get unfair advantages through ad spending",
          "Foreign interference through paid political content threatens democracy"
        ],
        con: [
          "Political advertising is protected free speech",
          "Banning ads limits candidates' ability to reach voters",
          "Transparency and fact-checking are better solutions than censorship"
        ]
      }
    },
    // Politics Topics
    {
      id: 'politics-1',
      title: "Should voting be mandatory in democratic countries?",
      description: "Debate compulsory voting and civic responsibility",
      difficulty: 'Medium',
      category: 'Democratic Participation',
      timeEstimate: '12-15 min',
      theme: 'Politics',
      aiArguments: {
        pro: [
          "Mandatory voting ensures government represents the entire population",
          "It reduces the influence of extreme political groups",
          "Countries like Australia show it works successfully"
        ],
        con: [
          "Forcing people to vote violates individual freedom",
          "Uninformed forced votes can harm democratic quality",
          "The right to vote includes the right not to vote"
        ]
      }
    },
    // Environment Topics
    {
      id: 'env-1',
      title: "Should fast fashion be banned to save the environment?",
      description: "Discuss the environmental impact of disposable clothing",
      difficulty: 'Easy',
      category: 'Sustainable Fashion',
      timeEstimate: '10-12 min',
      theme: 'Environment',
      aiArguments: {
        pro: [
          "Fast fashion is one of the world's largest polluting industries",
          "It promotes wasteful consumption and exploits workers",
          "Sustainable alternatives exist and are becoming more affordable"
        ],
        con: [
          "Fast fashion makes clothing accessible to low-income families",
          "Banning it would eliminate millions of jobs globally",
          "Consumer education is better than government bans"
        ]
      }
    },
    // Food Topics
    {
      id: 'food-1',
      title: "Should schools serve only vegetarian meals?",
      description: "Debate plant-based nutrition in educational institutions",
      difficulty: 'Easy',
      category: 'School Nutrition',
      timeEstimate: '10-12 min',
      theme: 'Food',
      aiArguments: {
        pro: [
          "Plant-based diets are healthier and reduce childhood obesity",
          "Vegetarian meals have a lower environmental impact",
          "It teaches children compassion towards animals"
        ],
        con: [
          "Children need protein from meat for proper development",
          "Many families' cultural and religious practices include meat",
          "Schools should offer choice, not impose dietary restrictions"
        ]
      }
    },
    // Cinema Topics
    {
      id: 'cinema-1',
      title: "Should movie theaters be replaced by streaming platforms?",
      description: "Debate the future of cinema experience vs convenience",
      difficulty: 'Easy',
      category: 'Entertainment Industry',
      timeEstimate: '10-12 min',
      theme: 'Cinema',
      aiArguments: {
        pro: [
          "Streaming is more convenient and affordable for families",
          "Home viewing allows for pause, rewind, and comfort",
          "Streaming platforms offer more diverse content choices"
        ],
        con: [
          "Movie theaters provide unmatched audio-visual experience",
          "Cinema is a social activity that brings communities together",
          "Big-screen spectacles lose their impact on small screens"
        ]
      }
    },
    // Health Topics
    {
      id: 'health-1',
      title: "Should mental health days be mandatory in schools and workplaces?",
      description: "Discuss the importance of mental health in productivity",
      difficulty: 'Medium',
      category: 'Workplace Wellness',
      timeEstimate: '12-15 min',
      theme: 'Health',
      aiArguments: {
        pro: [
          "Mental health is as important as physical health",
          "Mandatory breaks prevent burnout and improve productivity",
          "It reduces stigma around mental health issues"
        ],
        con: [
          "People can already take sick days for mental health",
          "Mandatory days might be abused by some individuals",
          "Flexible personal time off is more effective than mandates"
        ]
      }
    }
  ];

  // Filter topics by theme and difficulty
  const filteredTopics = allTopics.filter(topic => 
    topic.theme === theme && topic.difficulty === difficulty
  );

  // If no topics match exactly, show all topics from the theme
  const topics = filteredTopics.length > 0 ? filteredTopics : allTopics.filter(topic => topic.theme === theme);

  const handleRandomTopic = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setSelectedTopic(randomTopic);
    setShowArguments(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Debate Topic</h1>
          <p className="text-gray-600">
            {theme} • {difficulty} Level • AI-powered arguments included
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRandomTopic}>
            <Shuffle className="h-4 w-4 mr-2" />
            Random Topic
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>

      {!selectedTopic ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className="card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedTopic(topic);
                setShowArguments(true);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{topic.category}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{topic.timeEstimate}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{selectedTopic.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedTopic.description}</CardDescription>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge className={getDifficultyColor(selectedTopic.difficulty)}>
                    {selectedTopic.difficulty}
                  </Badge>
                  <Badge variant="secondary">{selectedTopic.category}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {showArguments && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-shadow border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <Lightbulb className="h-5 w-5" />
                    <span>Pro Arguments (Supporting)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTopic.aiArguments.pro.map((argument, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 text-sm">{argument}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-shadow border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <Brain className="h-5 w-5" />
                    <span>Con Arguments (Opposing)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTopic.aiArguments.con.map((argument, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-800 text-sm">{argument}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => onTopicSelect(selectedTopic)}
              className="px-8"
            >
              Continue with This Topic
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSelection;
