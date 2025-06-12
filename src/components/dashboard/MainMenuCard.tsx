
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, Settings, Calendar, BookOpen, Zap } from 'lucide-react';

interface MainMenuCardProps {
  onStartDebate: () => void;
  onDebateLive: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
}

const MainMenuCard = ({ 
  onStartDebate, 
  onDebateLive,
  onCreateDebateRoom, 
  onViewEvents, 
  onResources 
}: MainMenuCardProps) => {
  const menuItems = [
    {
      icon: Bot,
      title: '🤖 Start Debate',
      description: 'Debate with AI - Practice with intelligent opponents',
      onClick: onStartDebate,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'gradient-indigo'
    },
    {
      icon: Zap,
      title: '⚡ Debate Live',
      description: 'Live debates with real people in any language',
      onClick: onDebateLive,
      borderColor: 'border-green-200',
      bgGradient: 'from-green-50 to-white',
      iconBg: 'bg-green-500'
    },
    {
      icon: Settings,
      title: '🏛️ Create Debate Room',
      description: 'Set up custom topics and debate formats',
      onClick: onCreateDebateRoom,
      borderColor: 'border-purple-200',
      bgGradient: 'from-purple-50 to-white',
      iconBg: 'bg-purple-500'
    },
    {
      icon: Calendar,
      title: '🎪 Events',
      description: 'Recent debates, competitions, and tournaments',
      onClick: onViewEvents,
      borderColor: 'border-orange-200',
      bgGradient: 'from-orange-50 to-white',
      iconBg: 'bg-orange-500'
    },
    {
      icon: BookOpen,
      title: '📚 Resources',
      description: 'Rules, techniques, blogs, videos & speech feedback',
      onClick: onResources,
      borderColor: 'border-blue-200',
      bgGradient: 'from-blue-50 to-white',
      iconBg: 'bg-blue-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item, index) => (
        <Card 
          key={index}
          className={`card-shadow-lg border-2 ${item.borderColor} bg-gradient-to-br ${item.bgGradient} hover:shadow-xl transition-all cursor-pointer`} 
          onClick={item.onClick}
        >
          <CardHeader className="text-center">
            <div className={`mx-auto ${item.iconBg} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
              <item.icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{item.title}</CardTitle>
            <CardDescription>
              {item.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default MainMenuCard;
