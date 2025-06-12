import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Video, Users, Mic, Globe } from 'lucide-react';

interface ResourcesProps {
  onBack: () => void;
}

const Resources = ({ onBack }: ResourcesProps) => {
  const [activeTab, setActiveTab] = useState<'speeches' | 'blogs' | 'videos' | 'rules' | 'foreign-policy' | 'speech-feedback'>('speeches');

  const speeches = [
    {
      id: 'obama-yes-we-can',
      speaker: 'Barack Obama',
      title: 'Yes We Can',
      year: '2008',
      category: 'Political',
      duration: '18 min',
      description: 'Presidential campaign victory speech',
      tags: ['Hope', 'Unity', 'Change']
    },
    {
      id: 'greta-un',
      speaker: 'Greta Thunberg',
      title: 'How Dare You',
      year: '2019',
      category: 'Environmental',
      duration: '4 min',
      description: 'UN Climate Action Summit speech',
      tags: ['Climate', 'Youth', 'Activism']
    },
    {
      id: 'kalam-youth',
      speaker: 'Dr. APJ Abdul Kalam',
      title: 'Dreams & Dedication',
      year: '2011',
      category: 'Inspirational',
      duration: '25 min',
      description: 'Address to students on vision and perseverance',
      tags: ['Dreams', 'Science', 'Youth']
    }
  ];

  const blogs = [
    {
      id: 'rhetoric-analysis',
      title: 'The Art of Political Rhetoric',
      author: 'MUN Academy',
      category: 'Analysis',
      readTime: '8 min read',
      description: 'Breaking down persuasive techniques used in famous political speeches'
    },
    {
      id: 'climate-discourse',
      title: 'Climate Change Discourse Evolution',
      author: 'Policy Experts',
      category: 'Current Events',
      readTime: '12 min read',
      description: 'How climate change rhetoric has evolved from scientific to moral arguments'
    }
  ];

  const videos = [
    {
      id: 'debate-techniques',
      title: 'Advanced Debate Techniques',
      creator: 'Debate Masters',
      duration: '45 min',
      category: 'Educational',
      description: 'Masterclass on argumentation and rebuttal strategies'
    },
    {
      id: 'mun-best-practices',
      title: 'MUN Best Practices',
      creator: 'Harvard MUN',
      duration: '30 min',
      category: 'MUN Training',
      description: 'Professional tips for Model UN participation'
    }
  ];

  const renderSpeechFeedback = () => (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5 text-purple-600" />
          <span>MUN Speech Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>United States</option>
              <option>China</option>
              <option>India</option>
              <option>Russia</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Speech
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md h-32"
              placeholder="Paste your MUN speech here to get feedback based on your country's stance..."
            />
          </div>
          <Button className="gradient-indigo text-white">
            Get AI Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRules = () => (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span>Rules & Procedures</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">UNA-USA Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                United Nations Association procedures and parliamentary rules
              </p>
              <Button size="sm">View Rules</Button>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Indian Parliamentary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Indian Parliamentary debate format and procedures
              </p>
              <Button size="sm">View Rules</Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderForeignPolicy = () => (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-green-600" />
          <span>Foreign Policy Learning</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            Learn about different countries' positions and bloc strategies for effective MUN participation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Country Positions</h4>
              <p className="text-sm text-blue-700 mt-1">
                Understand historical stances and policy priorities
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Bloc Strategies</h4>
              <p className="text-sm text-green-700 mt-1">
                Learn alliance patterns and negotiation tactics
              </p>
            </div>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Resources</h1>
          <p className="text-gray-600 mt-2">Everything you need for debate and MUN success</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: 'speeches', label: 'Famous Speeches', icon: Users },
          { id: 'blogs', label: 'Analysis Blogs', icon: BookOpen },
          { id: 'videos', label: 'Educational Videos', icon: Video },
          { id: 'rules', label: 'Rules & Procedures', icon: BookOpen },
          { id: 'foreign-policy', label: 'Foreign Policy', icon: Globe },
          { id: 'speech-feedback', label: 'Speech Feedback', icon: Mic }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id as any)}
            className="mb-2"
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'speeches' && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Famous Speeches</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {speeches.map((speech) => (
                <Card key={speech.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{speech.speaker}</h4>
                        <p className="text-sm font-medium text-gray-700">{speech.title}</p>
                      </div>
                      <Badge variant="outline">{speech.year}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">{speech.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {speech.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{speech.category}</span>
                      <span>{speech.duration}</span>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Analyze Speech
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'blogs' && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>Analysis Blogs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">{blog.title}</h4>
                      <Badge variant="outline">{blog.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">by {blog.author}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{blog.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{blog.readTime}</span>
                      <Button size="sm">Read Blog</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'videos' && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-purple-600" />
              <span>Educational Videos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video) => (
                <Card key={video.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">{video.title}</h4>
                      <Badge variant="outline">{video.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">by {video.creator}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{video.duration}</span>
                      <Button size="sm">Watch Video</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'rules' && renderRules()}
      {activeTab === 'foreign-policy' && renderForeignPolicy()}
      {activeTab === 'speech-feedback' && renderSpeechFeedback()}
    </div>
  );
};

export default Resources;
