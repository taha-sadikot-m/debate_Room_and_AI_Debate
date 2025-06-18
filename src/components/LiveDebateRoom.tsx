import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, Target, Trophy, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  time_estimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface LiveDebateRoomProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onBack: () => void;
  onStartDebate: (topic: Topic, opponent: OnlineUser) => void;
}

const LiveDebateRoom = ({ difficulty, theme, onBack, onStartDebate }: LiveDebateRoomProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<OnlineUser | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  // Suggest Topic Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newEstimate, setNewEstimate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const { data, error } = await supabase
          .from('debate_topics')
          .select('*')
          .eq('status', 'approved')
          .eq('difficulty', difficulty)
          .eq('theme', theme)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTopics(data || []);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [difficulty, theme]);

  const handleSuggestTopic = async () => {
    if (!newTitle || !newDesc || !newCategory || !newEstimate) return;

    setSubmitting(true);
    const { error } = await supabase.from('debate_topics').insert([
      {
        title: newTitle,
        description: newDesc,
        category: newCategory,
        time_estimate: newEstimate,
        difficulty,
        theme,
        status: 'pending',
        aiArguments: { pro: [], con: [] },
      },
    ]);

    if (error) {
      toast({ title: 'Error', description: 'Could not suggest topic. Try again later.' });
    } else {
      toast({ title: 'Success', description: 'Topic suggested successfully!' });
      setNewTitle('');
      setNewDesc('');
      setNewCategory('');
      setNewEstimate('');
    }
    setSubmitting(false);
  };

  const mockUsers: OnlineUser[] = [
    {
      id: 'user-1',
      name: 'Alice Johnson',
      avatar: '',
      level: 'Intermediate',
      tokens: 120,
      country: 'USA',
      status: 'available',
    },
    {
      id: 'user-2',
      name: 'Bob Williams',
      avatar: '',
      level: 'Beginner',
      tokens: 85,
      country: 'Canada',
      status: 'available',
    },
    {
      id: 'user-3',
      name: 'Charlie Brown',
      avatar: '',
      level: 'Advanced',
      tokens: 210,
      country: 'UK',
      status: 'in-debate',
    },
  ];

  const availableUsers = mockUsers.filter(user => user.status === 'available');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Debate Room</h1>
          <p className="text-gray-600 mt-2">Select a topic and an opponent to start a live debate</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex justify-end mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Suggest a Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Suggest a New Topic</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
              </div>
              <div>
                <Label>Estimated Time</Label>
                <Input value={newEstimate} onChange={(e) => setNewEstimate(e.target.value)} />
              </div>
              <Button onClick={handleSuggestTopic} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Suggestion'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Rest of your topic and user selection UI remains unchanged --- */}
      {/* Insert your full topic and user card UI here like before */}

      {/* Start Debate Button */}
      <div className="flex justify-center">
        <Button
          className="bg-green-500 hover:bg-green-600"
          size="lg"
          disabled={!selectedTopic || !selectedOpponent}
          onClick={() => {
            if (selectedTopic && selectedOpponent) {
              onStartDebate(selectedTopic, selectedOpponent);
            }
          }}
        >
          Start Debate
        </Button>
      </div>
    </div>
  );
};

export default LiveDebateRoom;
