
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, Clock, User, ExternalLink } from 'lucide-react';

interface DebatesHubProps {
  onBack: () => void;
}

const DebatesHub = ({ onBack }: DebatesHubProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Win Any Argument",
      excerpt: "Master the art of persuasion with these proven debate techniques",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop",
      tags: ["Debate Tips", "Beginner"],
      readTime: "5 min read",
      author: "Sarah Chen"
    },
    {
      id: 2,
      title: "The Art of Civil Disagreement",
      excerpt: "How to maintain respect while making your point in heated debates",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      tags: ["Speech Craft", "Advanced"],
      readTime: "8 min read",
      author: "Dr. Rajesh Kumar"
    },
    {
      id: 3,
      title: "My First MUN Experience",
      excerpt: "A student's journey through their first Model United Nations conference",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      tags: ["MUN Diaries", "Beginner"],
      readTime: "6 min read",
      author: "Alex Thompson"
    },
    {
      id: 4,
      title: "Crisis Committee Mastery",
      excerpt: "Advanced strategies for dominating crisis committees in MUN",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop",
      tags: ["MUN Diaries", "Advanced"],
      readTime: "12 min read",
      author: "Maria Rodriguez"
    },
    {
      id: 5,
      title: "Debate Preparation Checklist",
      excerpt: "Never miss a step with this comprehensive preparation guide",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      tags: ["Debate Tips", "Beginner"],
      readTime: "4 min read",
      author: "James Wilson"
    },
    {
      id: 6,
      title: "Building Confidence on Stage",
      excerpt: "Overcome stage fright and present with authority and poise",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      tags: ["Speech Craft", "Beginner"],
      readTime: "7 min read",
      author: "Priya Sharma"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Greta Thunberg's Powerful UN Speech",
      description: "How dare you! A masterclass in passionate advocacy",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=225&fit=crop",
      duration: "4:32",
      tags: ["Keynote", "Beginner"],
      views: "2.1M"
    },
    {
      id: 2,
      title: "Oxford Union Debate Highlights",
      description: "Best moments from the world's most prestigious debate society",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
      duration: "12:45",
      tags: ["Debate Tips", "Advanced"],
      views: "890K"
    },
    {
      id: 3,
      title: "Harvard MUN Crisis Simulation",
      description: "Watch delegates navigate a complex international crisis",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop",
      duration: "18:20",
      tags: ["MUN Diaries", "Advanced"],
      views: "456K"
    },
    {
      id: 4,
      title: "Debate Techniques for Beginners",
      description: "Learn the fundamentals of structured argumentation",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=225&fit=crop",
      duration: "8:15",
      tags: ["Debate Tips", "Beginner"],
      views: "1.3M"
    }
  ];

  const filterContent = (content: any[], type: 'blog' | 'video') => {
    if (selectedFilter === 'all') return content;
    if (selectedFilter === 'blogs' && type !== 'blog') return [];
    if (selectedFilter === 'videos' && type !== 'video') return [];
    
    return content.filter(item => 
      item.tags.some((tag: string) => 
        tag.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        selectedFilter === 'beginner' && tag === 'Beginner' ||
        selectedFilter === 'advanced' && tag === 'Advanced'
      )
    );
  };

  const filteredBlogs = filterContent(blogPosts, 'blog');
  const filteredVideos = filterContent(videos, 'video');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Explore Debates & MUNs</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Dive into the art of public speaking, diplomacy, and global leadership.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full max-w-2xl">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="debate tips">Tips</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Blog Section */}
      {(selectedFilter === 'all' || selectedFilter === 'blogs' || filteredBlogs.length > 0) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
            <span>📝</span>
            <span>Featured Articles</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/90">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Video Section */}
      {(selectedFilter === 'all' || selectedFilter === 'videos' || filteredVideos.length > 0) && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
            <span>🎥</span>
            <span>Watch & Learn</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 group-hover:bg-white transition-colors">
                      <Play className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/90">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                    {video.title}
                  </CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{video.views} views</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredBlogs.length === 0 && filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No content found for the selected filter.</p>
          <Button 
            variant="outline" 
            onClick={() => setSelectedFilter('all')}
            className="mt-4"
          >
            Show All Content
          </Button>
        </div>
      )}
    </div>
  );
};

export default DebatesHub;
