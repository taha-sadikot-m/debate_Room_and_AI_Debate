
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy } from 'lucide-react';
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
      {/* Header Section with Tokens */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to MyDebate.AI</h1>
        <p className="text-gray-600">Enhance your debate skills with AI-powered tools and live competitions</p>
        
        {/* Tokens Display */}
        <div className="flex justify-center">
          <Card className="card-shadow border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white cursor-pointer hover:shadow-lg transition-all" onClick={onViewTokens}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500 rounded-full">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-900">{userTokens}</p>
                  <p className="text-sm text-indigo-600 font-medium">My Tokens</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Coins className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
      <Card className="card-shadow border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader>
          <CardTitle className="text-indigo-900">🚀 Quick Tips to Improve</CardTitle>
          <CardDescription className="text-indigo-700">Enhance your debate skills with these tips</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
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
