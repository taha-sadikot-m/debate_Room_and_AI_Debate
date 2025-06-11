
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DebateHeaderProps {
  topic: string;
  debateType: 'ai' | '1v1' | 'mun';
  onExit: () => void;
}

const DebateHeader = ({ topic, debateType, onExit }: DebateHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Debate Room</h1>
        <p className="text-gray-600">{topic}</p>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          {debateType === 'ai' ? 'vs AI' : debateType === '1v1' ? '1v1 Match' : 'MUN Session'}
        </Badge>
        <Button variant="outline" onClick={onExit}>Exit Debate</Button>
      </div>
    </div>
  );
};

export default DebateHeader;
