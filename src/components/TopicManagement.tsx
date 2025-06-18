import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Check,
  X,
  Clock,
  FileText,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuggestedTopic {
  id: string;
  topic_name: string;
  theme: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  student_id: string;
}

const TopicManagement = () => {
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopic[]>([]);
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

  const themes = [
    'Technology',
    'Politics',
    'Environment',
    'Education',
    'Health',
    'Food',
    'Cinema',
    'Sports',
    'Economics',
    'Social Issues'
  ];

  useEffect(() => {
    fetchSuggestedTopics();
  }, []);

  const fetchSuggestedTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('suggested_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []).map(item => ({
        ...item,
        status: (['pending', 'approved', 'rejected'].includes(item.status)
          ? item.status
          : 'pending') as 'pending' | 'approved' | 'rejected'
      })) as SuggestedTopic[];

      setSuggestedTopics(typedData);
    } catch (error) {
      console.error('Error fetching suggested topics:', error);
      toast({
        title: "Error",
        description: "Failed to load suggested topics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicId: string, status: 'approved' | 'rejected') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('suggested_topics')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', topicId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Topic ${status} successfully`,
      });

      fetchSuggestedTopics();
    } catch (error) {
      console.error('Error updating topic status:', error);
      toast({
        title: "Error",
        description: "Failed to update topic status",
        variant: "destructive"
      });
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

      toast({
        title: "Topic Added",
        description: "New topic has been added to the debate topics",
      });

      addTopicForm.reset();
    } catch (error) {
      console.error('Error adding topic:', error);
      toast({
        title: "Error",
        description: "Failed to add topic",
        variant: "destructive"
      });
    } finally {
      setIsAddingTopic(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'approved': return <Check className="h-3 w-3" />;
      case 'rejected': return <X className="h-3 w-3" />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="p-6">Loading topic management...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Topic Management</h1>
          <p className="text-gray-600">Manage student suggestions and debate topics</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
            </DialogHeader>

            <Form {...addTopicForm}>
              <form onSubmit={addTopicForm.handleSubmit(onAddTopic)} className="space-y-4">
                <FormField
                  control={addTopicForm.control}
                  name="topicName"
                  rules={{ required: "Topic name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter topic name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addTopicForm.control}
                  name="theme"
                  rules={{ required: "Theme is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            {themes.map((theme) => (
                              <SelectItem key={theme} value={theme}>
                                {theme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addTopicForm.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addTopicForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Topic description..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addTopicForm.control}
                  name="timeEstimate"
                  rules={{ required: "Time estimate is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Estimate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 15 minutes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingTopic} className="flex-1">
                    {isAddingTopic ? 'Adding...' : 'Add Topic'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Student Suggestions</TabsTrigger>
          <TabsTrigger value="topics">Manage Topics</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4">
            {suggestedTopics.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
                  <p className="text-gray-600">Student topic suggestions will appear here</p>
                </CardContent>
              </Card>
            ) : (
              suggestedTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{topic.topic_name}</CardTitle>
                        <CardDescription className="mt-1">
                          Theme: {topic.theme}
                        </CardDescription>
                        {topic.description && (
                          <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(topic.status)}>
                          {getStatusIcon(topic.status)}
                          <span className="ml-1 capitalize">{topic.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {topic.status === 'pending' && (
                    <CardContent className="pt-0">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => updateTopicStatus(topic.id, 'approved')}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTopicStatus(topic.id, 'rejected')}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Topic Management</h3>
              <p className="text-gray-600">Manage existing debate topics (coming soon)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Theme Management</h3>
              <p className="text-gray-600">Manage debate themes (coming soon)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopicManagement;
