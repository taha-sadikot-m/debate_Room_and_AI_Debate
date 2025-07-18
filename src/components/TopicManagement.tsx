// ✅ REPLACEMENT TopicManagement.tsx

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, FileText, Settings, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Topic {
  id: string;
  title: string;
  theme: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const TopicManagement = () => {
  const [pendingTopics, setPendingTopics] = useState<Topic[]>([]);
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

  const themes = ['Technology', 'Politics', 'Education', 'Environment', 'Health', 'Cinema'];

  useEffect(() => {
    fetchPendingTopics();
  }, []);

  const fetchPendingTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('debate_topics')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load suggested topics", variant: "destructive" });
    } else {
      setPendingTopics(data || []);
    }
    setLoading(false);
  };

  const updateTopicStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('debate_topics')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to update topic status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Topic ${status}` });
      fetchPendingTopics();
    }
  };

  const onAddTopic = async (values: any) => {
    setIsAddingTopic(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('debate_topics').insert({
      topic_name: values.topicName.trim(),
      category: values.theme, // Using theme as category since that's what's in the form
      theme: values.theme,
      description: values.description?.trim() || null,
      student_id: user?.id || null, // Allow null for demo/development
      status: 'approved' // Since this is admin adding, approve immediately
    });

    if (error) {
      console.error('Error adding topic:', error);
      toast({ title: "Error", description: "Failed to add topic", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Topic added successfully" });
      addTopicForm.reset();
      await fetchPendingTopics(); // Refresh the list
    }

    setIsAddingTopic(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Topic Management</h1>
          <p className="text-gray-600">Manage student suggestions and debate topics</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Topic</DialogTitle></DialogHeader>
            <Form {...addTopicForm}>
              <form onSubmit={addTopicForm.handleSubmit(onAddTopic)} className="space-y-4">
                <FormField name="topicName" control={addTopicForm.control} rules={{ required: true }} render={({ field }) => (
                  <FormItem><FormLabel>Topic Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="theme" control={addTopicForm.control} rules={{ required: true }} render={({ field }) => (
                  <FormItem><FormLabel>Theme</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select a theme" /></SelectTrigger>
                      <SelectContent>{themes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="difficulty" control={addTopicForm.control} render={({ field }) => (
                  <FormItem><FormLabel>Difficulty</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl></FormItem>
                )} />
                <FormField name="description" control={addTopicForm.control} render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )} />
                <FormField name="timeEstimate" control={addTopicForm.control} render={({ field }) => (
                  <FormItem><FormLabel>Time Estimate</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <Button type="submit" className="w-full">{isAddingTopic ? "Adding..." : "Add Topic"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="suggestions">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="suggestions">Student Suggestions</TabsTrigger>
          <TabsTrigger value="topics">Manage Topics</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>
        <TabsContent value="suggestions">
          {loading ? <p>Loading...</p> : (
            pendingTopics.length === 0 ? (
              <Card><CardContent className="p-6 text-center">
                <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold">No suggestions yet</h3>
                <p className="text-gray-500">Student topic suggestions will appear here</p>
              </CardContent></Card>
            ) : pendingTopics.map(topic => (
              <Card key={topic.id}>
                <CardHeader>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>{topic.theme}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button onClick={() => updateTopicStatus(topic.id, 'approved')}>
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button variant="outline" onClick={() => updateTopicStatus(topic.id, 'rejected')}>
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="topics">
          <Card><CardContent className="p-6 text-center text-gray-500">Coming soon</CardContent></Card>
        </TabsContent>
        <TabsContent value="themes">
          <Card><CardContent className="p-6 text-center text-gray-500">Coming soon</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopicManagement;
