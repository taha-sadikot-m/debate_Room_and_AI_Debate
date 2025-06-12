
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play,
  Mic,
  BookOpen,
  ArrowLeft,
  Volume2,
  Clock,
  ExternalLink,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface FamousSpeechesProps {
  onBack: () => void;
}

const FamousSpeeches = ({ onBack }: FamousSpeechesProps) => {
  const [activeTab, setActiveTab] = useState('speeches');

  const speeches = [
    {
      id: 1,
      speaker: 'Greta Thunberg',
      title: 'How Dare You - UN Climate Action Summit',
      duration: '4:58',
      category: 'Climate',
      videoId: 'KAJsdgTPJpU',
      description: 'Passionate climate activism with emotional appeal',
      analysis: {
        tone: 'Passionate, Angry',
        vocabulary: 'Simple yet powerful',
        emotionalRange: 'High intensity, moral outrage'
      },
      currentRelevance: 'Highly relevant as COP28 discussions continue globally'
    },
    {
      id: 2,
      speaker: 'Barack Obama',
      title: 'Yes We Can - Victory Speech 2008',
      duration: '17:32',
      category: 'Politics',
      videoId: 'Fe751kMFVVg',
      description: 'Inspirational victory speech with hope and unity',
      analysis: {
        tone: 'Inspirational, Hopeful',
        vocabulary: 'Eloquent and accessible',
        emotionalRange: 'Uplifting, measured delivery'
      },
      currentRelevance: 'Lessons in unity and hope during political polarization'
    },
    {
      id: 3,
      speaker: 'Dr. APJ Abdul Kalam',
      title: 'Dreams Transform into Thoughts',
      duration: '12:45',
      category: 'Education',
      videoId: 'Yh4jFMOdFPs',
      description: 'Inspiring youth to dream and achieve',
      analysis: {
        tone: 'Gentle, Motivational',
        vocabulary: 'Scientific yet poetic',
        emotionalRange: 'Warm, encouraging'
      },
      currentRelevance: 'Critical for inspiring innovation in digital age'
    },
    {
      id: 4,
      speaker: 'Malala Yousafzai',
      title: 'Education for All - UN Speech',
      duration: '16:18',
      category: 'Education',
      videoId: '3rNhZu3ttIU',
      description: 'Powerful advocacy for girls\' education',
      analysis: {
        tone: 'Determined, Peaceful',
        vocabulary: 'Clear and purposeful',
        emotionalRange: 'Calm strength, unwavering resolve'
      },
      currentRelevance: 'Essential as global education gaps persist post-pandemic'
    },
    {
      id: 5,
      speaker: 'Volodymyr Zelenskyy',
      title: 'Address to the World - 2022',
      duration: '8:15',
      category: 'Politics',
      videoId: 'dtFuGI0cK54',
      description: 'Wartime leadership and international appeal',
      analysis: {
        tone: 'Urgent, Defiant',
        vocabulary: 'Direct and compelling',
        emotionalRange: 'Intense, resolute'
      },
      currentRelevance: 'Current global conflict and leadership under pressure'
    }
  ];

  const blogs = [
    {
      id: 1,
      title: 'The Rhetoric of Climate Activism: Analyzing Greta\'s Impact',
      author: 'Dr. Sarah Mitchell',
      date: '2024-01-15',
      category: 'Climate',
      excerpt: 'How teenage climate activist Greta Thunberg revolutionized environmental discourse through passionate, direct communication...',
      readTime: '8 min read',
      trending: true
    },
    {
      id: 2,
      title: 'Presidential Oratory in the Digital Age',
      author: 'Prof. James Wilson',
      date: '2024-01-10',
      category: 'Politics',
      excerpt: 'Examining how modern presidents adapt traditional rhetoric for social media and global audiences...',
      readTime: '12 min read',
      trending: false
    },
    {
      id: 3,
      title: 'From Malala to Gen Z: Youth Voices in Global Politics',
      author: 'Dr. Priya Sharma',
      date: '2024-01-08',
      category: 'Education',
      excerpt: 'The evolution of youth activism and its impact on international policy and social change...',
      readTime: '15 min read',
      trending: true
    },
    {
      id: 4,
      title: 'Wartime Communication: Leadership Under Crisis',
      author: 'Prof. Michael Chen',
      date: '2024-01-05',
      category: 'Politics',
      excerpt: 'How leaders communicate effectively during times of conflict and uncertainty...',
      readTime: '10 min read',
      trending: true
    }
  ];

  const currentEvents = [
    {
      id: 1,
      event: 'UN Climate Summit COP28 Outcomes',
      date: '2024-01-12',
      relevantSpeaker: 'Greta Thunberg',
      summary: 'Latest climate commitments and their rhetorical strategies',
      impact: 'High'
    },
    {
      id: 2,
      event: 'Global Education Crisis Post-Pandemic',
      date: '2024-01-10',
      relevantSpeaker: 'Malala Yousafzai',
      summary: 'Educational inequality and advocacy responses worldwide',
      impact: 'High'
    },
    {
      id: 3,
      event: 'Digital Rights and AI Governance Debates',
      date: '2024-01-08',
      relevantSpeaker: 'Various Tech Leaders',
      summary: 'Current debates on AI regulation and digital privacy',
      impact: 'Medium'
    },
    {
      id: 4,
      event: 'Youth Climate Activism Movement',
      date: '2024-01-05',
      relevantSpeaker: 'Greta Thunberg',
      summary: 'Recent youth-led climate protests and their messaging',
      impact: 'High'
    }
  ];

  const handlePracticeSpeech = (speech: any) => {
    console.log('Starting practice mode for:', speech.title);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Famous Speeches & Analysis</h1>
          <p className="text-gray-600 mt-2">Learn from the greatest orators and current events</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="speeches">Speeches</TabsTrigger>
          <TabsTrigger value="blogs">Analysis Blogs</TabsTrigger>
          <TabsTrigger value="current">Current Events</TabsTrigger>
          <TabsTrigger value="topics">Topics by Theme</TabsTrigger>
        </TabsList>

        {/* Speeches Tab */}
        <TabsContent value="speeches" className="space-y-6">
          {/* Learning Tips */}
          <Card className="card-shadow bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>How to Learn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-blue-600" />
                  <span>Watch the full speech</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mic className="h-4 w-4 text-blue-600" />
                  <span>Practice delivery with AI feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  <span>Analyze tone and emotional range</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speeches Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {speeches.map((speech) => (
              <Card key={speech.id} className="card-shadow hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{speech.speaker}</CardTitle>
                      <CardDescription className="font-medium">{speech.title}</CardDescription>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="outline">{speech.category}</Badge>
                      {speech.currentRelevance && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Current</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Video Embed */}
                  <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${speech.videoId}`}
                      title={speech.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    ></iframe>
                  </div>

                  {/* Speech Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{speech.duration}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{speech.description}</p>

                  {/* Current Relevance */}
                  {speech.currentRelevance && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1 text-green-900">Why it's relevant today:</h5>
                      <p className="text-xs text-green-800">{speech.currentRelevance}</p>
                    </div>
                  )}

                  {/* Analysis */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Speech Analysis</h4>
                    <div className="space-y-1 text-xs">
                      <div><span className="font-medium">Tone:</span> {speech.analysis.tone}</div>
                      <div><span className="font-medium">Vocabulary:</span> {speech.analysis.vocabulary}</div>
                      <div><span className="font-medium">Emotional Range:</span> {speech.analysis.emotionalRange}</div>
                    </div>
                  </div>

                  {/* Practice Button */}
                  <Button 
                    className="w-full"
                    onClick={() => handlePracticeSpeech(speech)}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    🎙 Practice this Speech
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="card-shadow hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{blog.title}</CardTitle>
                      <CardDescription>By {blog.author}</CardDescription>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="outline">{blog.category}</Badge>
                      {blog.trending && (
                        <Badge className="bg-orange-100 text-orange-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{blog.date}</span>
                    </div>
                    <span>{blog.readTime}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read Full Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Current Events Tab */}
        <TabsContent value="current" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>🌍 Current Global Events & Speech Analysis</CardTitle>
              <CardDescription>How recent events connect to famous speeches and rhetoric</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentEvents.map((event) => (
                  <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{event.event}</h4>
                      <Badge variant={event.impact === 'High' ? 'default' : 'secondary'}>
                        {event.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Related Speaker: {event.relevantSpeaker}</span>
                      <span>{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topics by Theme Tab */}
        <TabsContent value="topics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Climate', 'Politics', 'Education', 'Technology', 'Human Rights'].map((theme) => (
              <Card key={theme} className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{theme}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">Current UN debates on {theme.toLowerCase()}</div>
                    <div className="p-2 bg-gray-50 rounded">Recent {theme.toLowerCase()} policies worldwide</div>
                    <div className="p-2 bg-gray-50 rounded">{theme} activism and youth movements</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Explore {theme} Topics
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamousSpeeches;
