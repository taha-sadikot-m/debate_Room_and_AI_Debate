
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, Settings, Calendar, BookOpen, Zap, Crown, Globe, Newspaper } from 'lucide-react';

interface MainMenuCardProps {
  onStartDebate: () => void;
  onInstantDebate: () => void;
  onDebateLive: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
  onPublicSpeaking: () => void;
  onDebatesHub: () => void;
  onEnhancedTopicSelection?: () => void;
  onAdvancedTopicManager?: () => void;
  onRealTimeDebate?: () => void;
}

const MainMenuCard = ({ 
  onStartDebate, 
  onInstantDebate,
  onDebateLive,
  onJoinMUN,
  onCreateDebateRoom, 
  onViewEvents, 
  onResources,
  onPublicSpeaking,
  onDebatesHub,
  onEnhancedTopicSelection,
  onAdvancedTopicManager,
  onRealTimeDebate
}: MainMenuCardProps) => {
  const menuItems = [
    {
      icon: Bot,
      title: '🤖 Instant Debate',
      description: 'Start debating with AI instantly! Complete with room, evaluation & history',
      onClick: () => {
        console.log('Instant Debate card clicked - launching complete debate experience');
        onInstantDebate();
      },
      borderColor: 'border-purple-300',
      bgGradient: 'from-purple-100 via-indigo-50 to-white',
      iconBg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      featured: true
    },
    {
      icon: Zap,
      title: '⚡ Debate Live',
      description: 'Live debates with real people in any language',
      onClick: onDebateLive,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-500'
    },
    {
      icon: Globe,
      title: '🌍 MUN Mode',
      description: 'Model United Nations with Gavel Bro AI moderator',
      onClick: onJoinMUN,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-600'
    },
    {
      icon: Bot,
      title: '🤖 Debate with Gabbar',
      description: 'Challenge our fierce Indian AI opponent - Gabbar',
      onClick: onStartDebate,
      borderColor: 'border-gray-200',
      bgGradient: 'from-gray-50 to-white',
      iconBg: 'bg-gray-700'
    },
    {
      icon: Newspaper,
      title: '📰 Debates & MUNs Hub',
      description: 'Articles, videos, and resources for debate mastery',
      onClick: onDebatesHub,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-500'
    },
    {
      icon: Users,
      title: '👥 Human vs Human Debate',
      description: 'Debate with real people in real time - create or join debate rooms',
      onClick: onRealTimeDebate || (() => console.log('Real-time debate not available')),
      borderColor: 'border-blue-300',
      bgGradient: 'from-blue-100 via-indigo-50 to-white',
      iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      featured: true
    },
    {
      icon: Settings,
      title: '🔍 Enhanced Topic Selection',
      description: 'Advanced topic browsing, filtering and selection',
      onClick: onEnhancedTopicSelection || (() => console.log('Enhanced topic selection not available')),
      borderColor: 'border-green-200',
      bgGradient: 'from-green-50 to-white',
      iconBg: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: '📝 Topic Manager',
      description: 'Create, edit and manage debate topics & suggestions',
      onClick: onAdvancedTopicManager || (() => console.log('Advanced topic manager not available')),
      borderColor: 'border-blue-200',
      bgGradient: 'from-blue-50 to-white',
      iconBg: 'bg-blue-500'
    },
    {
      icon: Settings,
      title: '�🏛️ Create Debate Room',
      description: 'Set up custom topics and debate formats',
      onClick: onCreateDebateRoom,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-400'
    },
    {
      icon: Calendar,
      title: '🎪 Events',
      description: 'Recent debates, competitions, and tournaments',
      onClick: onViewEvents,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-500'
    },
    {
      icon: BookOpen,
      title: '📚 Resources',
      description: 'Rules, techniques, blogs, videos & speech feedback',
      onClick: onResources,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-600'
    },
    {
      icon: Users,
      title: '🎭 Public Speaking',
      description: 'Group discussions, JAM, Best Manager & more activities',
      onClick: onPublicSpeaking,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item, index) => (
        <Card 
          key={index}
          className={`
            relative card-shadow-lg border-2 ${item.borderColor} 
            bg-gradient-to-br ${item.bgGradient} 
            hover:shadow-xl transition-all cursor-pointer 
            ${item.featured ? 'hover:border-purple-400 ring-2 ring-purple-200 hover:ring-purple-300' : 'hover:border-indigo-300'}
            ${item.featured ? 'transform hover:scale-105' : ''}
          `} 
          onClick={item.onClick}
        >
          <CardHeader className="text-center">
            {item.featured && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                ✨ Featured
              </div>
            )}
            <div className={`mx-auto ${item.iconBg} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 ${item.featured ? 'shadow-lg' : ''}`}>
              <item.icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className={`text-xl ${item.featured ? 'text-purple-900 font-bold' : 'text-gray-900'}`}>
              {item.title}
            </CardTitle>
            <CardDescription className={`${item.featured ? 'text-purple-700 font-medium' : 'text-gray-600'}`}>
              {item.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default MainMenuCard;
