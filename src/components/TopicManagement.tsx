
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
  Edit, 
  Trash2, 
  Clock,
  Eye,
  FileText,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuggestedTopic {
  id: string;
  topic_name: string;
  category: string;
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
      category: '',
      description: '',
      difficulty: 'Medium'
    }
  });

  const categories = [
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
      setSuggestedTopics(data || []);
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
      // Here you would add the topic to your main topics data
      // For now, we'll just show a success message
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
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
          <TabsTrigger value="suggestions" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Suggestions</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Current Topics</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Topic Suggestions</CardTitle>
              <CardDescription>
                Review and manage topics suggested by students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestedTopics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No topic suggestions yet
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestedTopics.map((topic) => (
                    <div 
                      key={topic.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{topic.topic_name}</h3>
                            <Badge className={getStatusColor(topic.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(topic.status)}
                                <span className="capitalize">{topic.status}</span>
                              </span>
                            </Badge>
                            <Badge variant="outline">{topic.category}</Badge>
                          </div>
                          
                          {topic.description && (
                            <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                          )}
                          
                          <p className="text-xs text-gray-500">
                            Submitted on {new Date(topic.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {topic.status === 'pending' && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => updateTopicStatus(topic.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateTopicStatus(topic.id, 'rejected')}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Debate Topics</CardTitle>
              <CardDescription>
                Manage existing topics and their categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Topic management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Add, edit, or remove topic categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Category management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopicManagement;
