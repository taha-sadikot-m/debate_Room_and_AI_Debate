
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import MainMenuCard from '@/components/dashboard/MainMenuCard';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: () => void;
  onDebateLive: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
  onViewTokens: () => void;
  onPublicSpeaking: () => void;
}

const StudentDashboard = ({ 
  userTokens, 
  onStartDebate, 
  onDebateLive,
  onJoinMUN, 
  onCreateDebateRoom, 
  onViewEvents, 
  onResources, 
  onViewTokens,
  onPublicSpeaking
}: StudentDashboardProps) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to MyDebate.AI</h1>
        <p className="text-gray-600 mt-2">Enhance your debate skills with AI-powered tools and live competitions</p>
      </div>

      {/* Main Menu */}
      <MainMenuCard 
        onStartDebate={onStartDebate}
        onDebateLive={onDebateLive}
        onJoinMUN={onJoinMUN}
        onCreateDebateRoom={onCreateDebateRoom}
        onViewEvents={onViewEvents}
        onResources={onResources}
        onPublicSpeaking={onPublicSpeaking}
      />

      {/* Quick Tips Section */}
      <Card className="card-shadow border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle>🚀 Quick Tips to Improve</CardTitle>
          <CardDescription>Enhance your debate skills with these tips</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Research your topic thoroughly</li>
            <li>Practice your speaking and delivery</li>
            <li>Listen actively to your opponent</li>
            <li>Structure your arguments logically</li>
            <li>Use evidence to support your claims</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
