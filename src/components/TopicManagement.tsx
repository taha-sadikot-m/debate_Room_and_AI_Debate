// teacher-side TopicManagement.tsx
import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Button, Badge, Input, Textarea,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui';
import { useForm } from 'react-hook-form';
import { Plus, Check, X, Clock, FileText, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DebateTopic {
  id: string;
  title: string;
  theme: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  created_by: string;
  difficulty: string;
  time_estimate: string;
}

const TopicManagement = () => {
  const [topics, setTopics] = useState<DebateTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const { toast } = useToast();

  const addTopicForm = useForm({
    defaultValues: {
      topicName: '',
      theme: '',
      description: '',
      difficulty: 'Medium',
      timeEstimate: ''
    }
  });

  const themes = ['Technology', 'Politics', 'Environment', 'Education', 'Health', 'Food', 'Cinema', 'Sports', 'Economics', 'Social Issues'];

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics((data || []) as DebateTopic[]);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast({ title: "Error", description: "Failed to load topics", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('debate_topics')
        .update({ status })
        .eq('id', topicId);

      if (error) throw error;

      toast({ title: "Success", description: `Topic ${status}` });
      fetchTopics();
    } catch (error) {
      console.error('Error updating topic status:', error);
      toast({ title: "Error", description: "Failed to update topic status", variant: "destructive" });
    }
  };

  const onAddTopic = async (values: any) => {
    setIsAddingTopic(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('debate_topics')
        .insert({
          title: values.topicName.trim(),
          theme: values.theme,
          difficulty: values.difficulty,
          description: values.description?.trim() || null,
          time_estimate: values.timeEstimate.trim(),
          created_by: user?.id || null,
          status: 'approved'
        });

      if (error) throw error;

      toast({ title: "Topic Added", description: "New topic has been added" });
      addTopicForm.reset();
      fetchTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
      toast({ title: "Error", description: "Failed to add topic", variant: "destructive" });
    } finally {
      setIsAddingTopic(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map = {
      pending: ['bg-yellow-100 text-yellow-700', <Clock className="h-3 w-3" />],
      approved: ['bg-green-100 text-green-700', <Check className="h-3 w-3" />],
      rejected: ['bg-red-100 text-red-700', <X className="h-3 w-3" />],
    };
    const [cls, icon] = map[status] || ['bg-gray-100 text-gray-700', null];
    return <Badge className={cls}>{icon}<span className="ml-1 capitalize">{status}</span></Badge>;
  };

  const pendingTopics = topics.filter(t => t.status === 'pending');

  if (loading) return <div className="p-6">Loading topic management...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Topic Management</h1>
          <p className="text-gray-600">Approve student suggestions and manage debate topics</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add New Topic</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Topic</DialogTitle></DialogHeader>
            <Form {...addTopicForm}>
              <form onSubmit={addTopicForm.handleSubmit(onAddTopic)} className="space-y-4">
                <FormField control={addTopicForm.control} name="topicName" rules={{ required: "Required" }}
                  render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addTopicForm.control} name="theme" rules={{ required: "Required" }}
                  render={({ field }) => (<FormItem><FormLabel>Theme</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
                      <SelectContent>{themes.map((theme) => <SelectItem key={theme} value={theme}>{theme}</SelectItem>)}</SelectContent>
                    </Select></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addTopicForm.control} name="difficulty"
                  render={({ field }) => (<FormItem><FormLabel>Difficulty</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent>
                    </Select></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addTopicForm.control} name="description"
                  render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addTopicForm.control} name="timeEstimate" rules={{ required: "Required" }}
                  render={({ field }) => (<FormItem><FormLabel>Time Estimate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="flex space-x-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={isAddingTopic} className="flex-1">{isAddingTopic ? 'Adding...' : 'Add Topic'}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Student Suggestions</TabsTrigger>
          <TabsTrigger value="all">All Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTopics.length === 0 ? (
            <Card><CardContent className="p-6 text-center"><FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" /><p>No suggestions yet</p></CardContent></Card>
          ) : pendingTopics.map((topic) => (
            <Card key={topic.id}><CardHeader><CardTitle>{topic.title}</CardTitle><CardDescription>{topic.description}</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                <p>Theme: {topic.theme}</p>
                {getStatusBadge(topic.status)}
                <div className="flex gap-2">
                  <Button onClick={() => updateTopicStatus(topic.id, 'approved')}><Check className="w-4 h-4 mr-1" /> Approve</Button>
                  <Button variant="outline" onClick={() => updateTopicStatus(topic.id, 'rejected')}><X className="w-4 h-4 mr-1" /> Reject</Button>
                </div>
              </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-4">
            {topics.map((topic) => (
              <Card key={topic.id}><CardHeader><CardTitle>{topic.title}</CardTitle><CardDescription>{topic.description}</CardDescription></CardHeader>
                <CardContent>{getStatusBadge(topic.status)}</CardContent></Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopicManagement;
