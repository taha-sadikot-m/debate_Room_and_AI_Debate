
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Download,
  Settings,
  Plus,
  Eye,
  BarChart3,
  Calendar,
  Award,
  MessageSquare,
  FileText,
  Activity
} from 'lucide-react';

const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState('Grade 10A');

  const classrooms = [
    { name: 'Grade 10A', students: 24, activeDebates: 3, avgScore: 87 },
    { name: 'Grade 11B', students: 22, activeDebates: 2, avgScore: 82 },
    { name: 'Grade 12C', students: 20, activeDebates: 1, avgScore: 91 },
  ];

  const students = [
    { name: 'Sarah Johnson', avatar: 'SJ', debates: 15, winRate: 87, avgScore: 92, tokens: 245, status: 'active' },
    { name: 'Michael Chen', avatar: 'MC', debates: 12, winRate: 75, avgScore: 85, tokens: 189, status: 'active' },
    { name: 'Emma Davis', avatar: 'ED', debates: 18, winRate: 94, avgScore: 96, tokens: 312, status: 'online' },
    { name: 'Alex Rodriguez', avatar: 'AR', debates: 8, winRate: 62, avgScore: 78, tokens: 125, status: 'inactive' },
    { name: 'Olivia Wilson', avatar: 'OW', debates: 14, winRate: 85, avgScore: 89, tokens: 198, status: 'active' },
  ];

  const recentDebates = [
    { 
      topic: 'Climate Change Policy', 
      participants: ['Sarah J.', 'Michael C.'], 
      duration: '18 min', 
      scores: [92, 85], 
      status: 'completed',
      type: '1v1'
    },
    { 
      topic: 'Digital Privacy Rights', 
      participants: ['Emma D.', 'AI'], 
      duration: '15 min', 
      scores: [96, 88], 
      status: 'completed',
      type: 'ai'
    },
    { 
      topic: 'Space Exploration', 
      participants: ['MUN Session'], 
      duration: '45 min', 
      scores: [89], 
      status: 'ongoing',
      type: 'mun'
    },
  ];

  const assignments = [
    { title: 'Renewable Energy Debate', dueDate: '2024-01-15', submissions: 18, total: 24, status: 'active' },
    { title: 'AI Ethics Discussion', dueDate: '2024-01-20', submissions: 12, total: 24, status: 'active' },
    { title: 'Historical Perspectives', dueDate: '2024-01-10', submissions: 24, total: 24, status: 'completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Monitor student progress and manage debates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classrooms.map((classroom, index) => (
          <Card 
            key={index} 
            className={`card-shadow cursor-pointer transition-all duration-200 ${
              selectedClass === classroom.name ? 'ring-2 ring-indigo-500' : 'hover:card-shadow-lg'
            }`}
            onClick={() => setSelectedClass(classroom.name)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{classroom.name}</h3>
                <Badge variant="secondary">{classroom.activeDebates} active</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-medium">{classroom.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Score</span>
                  <span className="font-medium">{classroom.avgScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Debates</span>
                  <span className="font-medium">{classroom.activeDebates}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Student Performance - {selectedClass}</span>
              </CardTitle>
              <CardDescription>Individual student progress and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.debates} debates completed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{student.winRate}%</p>
                        <p className="text-xs text-gray-500">Win Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{student.avgScore}</p>
                        <p className="text-xs text-gray-500">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-yellow-600">{student.tokens}</p>
                        <p className="text-xs text-gray-500">Tokens</p>
                      </div>
                      <Badge 
                        variant={student.status === 'online' ? 'default' : student.status === 'active' ? 'secondary' : 'outline'}
                        className={
                          student.status === 'online' ? 'bg-green-100 text-green-700' :
                          student.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }
                      >
                        {student.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Debates */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span>Recent Debates</span>
              </CardTitle>
              <CardDescription>Live and completed debate sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDebates.map((debate, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{debate.topic}</h4>
                        <p className="text-sm text-gray-500">
                          {debate.type === 'mun' ? 'MUN Session' : debate.participants.join(' vs ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={debate.status === 'ongoing' ? 'default' : 'secondary'}>
                          {debate.status}
                        </Badge>
                        <Badge variant="outline">
                          {debate.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{debate.duration}</span>
                        </div>
                        {debate.scores.length > 1 && (
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Scores: {debate.scores.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Class Average</span>
                </div>
                <span className="font-medium text-green-600">87%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Active Sessions</span>
                </div>
                <span className="font-medium">6</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Total Tokens</span>
                </div>
                <span className="font-medium text-yellow-600">1,269</span>
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>Assignments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.map((assignment, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{assignment.title}</h4>
                    <Badge 
                      variant={assignment.status === 'completed' ? 'default' : 'secondary'}
                      className={assignment.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Due: {assignment.dueDate}</span>
                    <span className="text-gray-600">
                      {assignment.submissions}/{assignment.total} submitted
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Class Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
