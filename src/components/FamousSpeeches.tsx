
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Mic,
  BookOpen,
  ArrowLeft,
  Volume2,
  Clock
} from 'lucide-react';

interface FamousSpeechesProps {
  onBack: () => void;
}

const FamousSpeeches = ({ onBack }: FamousSpeechesProps) => {
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
      }
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
      }
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
      }
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
      }
    }
  ];

  const handlePracticeSpeech = (speech: any) => {
    console.log('Starting practice mode for:', speech.title);
    // This would open the speech practice mode
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Famous Speeches</h1>
          <p className="text-gray-600 mt-2">Learn from the greatest orators in history</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

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
                <Badge variant="outline">{speech.category}</Badge>
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
    </div>
  );
};

export default FamousSpeeches;
