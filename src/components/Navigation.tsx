import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Trophy, 
  User, 
  Settings,
  LogOut,
  Crown,
  Users
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface NavigationProps {
  userTokens: number;
  userRole: 'student' | 'teacher';
  onRoleSwitch: (role: 'student' | 'teacher') => void;
  onGetPremium?: () => void;
  onSignOut: () => void;
  user: User;
}

const Navigation = ({ userTokens, userRole, onRoleSwitch, onGetPremium, onSignOut, user }: NavigationProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleJoinCommunity = () => {
    window.open('https://discord.gg/symdebate', '_blank');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="gradient-indigo p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">mydebate.ai</h1>
              <p className="text-xs text-gray-500">AI-Powered Debate Platform</p>
            </div>
          </div>

          {/* User Info and Controls */}
          <div className="flex items-center space-x-4">
            {/* Tokens Display */}
            <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">{userTokens} tokens</span>
            </div>

            {/* Join Community Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleJoinCommunity}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <Users className="h-4 w-4 mr-1" />
              Join SYM Community
            </Button>

            {/* Get Premium Button */}
            {onGetPremium && (
              <Button
                variant="outline"
                size="sm"
                onClick={onGetPremium}
                className="gradient-indigo text-white border-none hover:opacity-90"
              >
                <Crown className="h-4 w-4 mr-1" />
                Get Premium
              </Button>
            )}

            {/* Role Switcher */}
            <div className="flex items-center space-x-2">
              <Button
                variant={userRole === 'student' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRoleSwitch('student')}
              >
                Student
              </Button>
              <Button
                variant={userRole === 'teacher' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRoleSwitch('teacher')}
                className="relative"
              >
                <Crown className="h-4 w-4 mr-1" />
                Teacher
              </Button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2"
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={onSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
