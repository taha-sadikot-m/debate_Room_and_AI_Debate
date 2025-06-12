
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User, Settings, Calendar, BookOpen } from 'lucide-react';

interface MainMenuCardProps {
  onStartDebate: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
}

const MainMenuCard = ({ 
  onStartDebate, 
  onCreateDebateRoom, 
  onViewEvents, 
  onResources 
}: MainMenuCardProps) => {
  const menuItems = [
    {
      icon: Bot,
      title: '🤖 Debate with AI',
      description: 'Challenge AI opponents with various difficulty levels',
      onClick: onStartDebate,
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'gradient-indigo'
    },
    {
      icon: User,
      title: '👥 Debate with User',
      description: '1v1 debates with other students and debaters',
      onClick: onStartDebate,
      borderColor: 'border-green-200',
      bgGradient: 'from-green-50 to-white',
      iconBg: 'bg-green-500'
    },
    {
      icon: Settings,
      title: '🏛️ Create Debate Room',
      description: 'Set up custom topics and debate formats',
      onClick: onCreateDebateRoom,
      borderColor: 'border-green-200',
      bgGradient: 'from-green-50 to-white',
      iconBg: 'bg-green-500'
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
