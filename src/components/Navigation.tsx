
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Coins, Crown, User, LogOut, Settings } from 'lucide-react';

interface NavigationProps {
  userTokens: number;
  userRole: 'student' | 'teacher';
  onRoleSwitch: (role: 'student' | 'teacher') => void;
  onGetPremium: () => void;
  onSignOut: () => void;
  user: any;
}

const Navigation = ({ 
  userTokens, 
  userRole, 
  onRoleSwitch, 
  onGetPremium, 
  onSignOut,
  user 
}: NavigationProps) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/80a86b55-ac06-4e1e-905b-e5574803f537.png" 
            alt="MyDebate.ai Logo" 
            className="h-10 w-10"
          />
          <h1 className="text-xl font-bold text-gray-900">MyDebate.ai</h1>
        </div>

        {/* Center - Role Switch */}
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
          >
            Teacher
          </Button>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Tokens */}
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              {userTokens} tokens
            </Badge>
          </div>

          {/* Premium Button */}
          <Button 
            size="sm" 
            onClick={onGetPremium}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Crown className="h-4 w-4 mr-2" />
            Get Premium
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user?.user_metadata?.full_name || 'Demo User'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
