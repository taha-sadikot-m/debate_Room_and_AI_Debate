import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Trophy } from 'lucide-react';
import MainMenuCard from '@/components/dashboard/MainMenuCard';
import TopicSuggestDialog from '@/components/dialogs/TopicSuggestDialog'; // 👈 Add import

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
  onDebatesHub: () => void;
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
  onPublicSpeaking,
  onDebatesHub
}: StudentDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section with Tokens */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white text-shadow">Welcome to MyDebate.AI</h1>
          <p className="text-purple-100 text-lg">Enhance your debate skills with AI-powered tools and live competitions</p>
          
          {/* Tokens Display */}
          <div className="flex justify-center">
            <Card className="card-shadow-lg border-2 border-cyan-300/30 bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all" onClick={onViewTokens}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full shadow-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{userTokens}</p>
                    <p className="text-sm text-cyan-200 font-medium">My Tokens</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg">
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
          onDebatesHub={onDebatesHub}
        />

        {/* 📢 Suggest a Topic Section */}
        <Card className="card-shadow-lg border-2 border-cyan-300/30 bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl">📢 Got an Idea for a Debate Topic?</CardTitle>
            <CardDescription className="text-cyan-200">
              Submit your suggestion and get it reviewed by our mentors!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopicSuggestDialog />
          </CardContent>
        </Card>

        {/* Quick Tips Section */}
        <Card className="card-shadow-lg border-2 border-cyan-300/30 bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl">🚀 Quick Tips to Improve</CardTitle>
            <CardDescription className="text-cyan-200">Enhance your debate skills with these tips</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-purple-100">
              <li>Research your topic thoroughly</li>
              <li>Practice your speaking and delivery</li>
              <li>Listen actively to your opponent</li>
              <li>Structure your arguments logically</li>
              <li>Use evidence to support your claims</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
