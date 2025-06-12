
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { Topic } from '@/data/topics';

interface TopicCardProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
}

const TopicCard = ({ topic, onSelect }: TopicCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card 
      className="card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(topic)}
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
  );
};

export default TopicCard;
