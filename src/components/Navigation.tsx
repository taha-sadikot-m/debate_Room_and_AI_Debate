
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Crown, 
  Trophy, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  userTokens: number;
  userRole: 'student' | 'teacher';
  onRoleSwitch: (role: 'student' | 'teacher') => void;
}

const Navigation = ({ userTokens, userRole, onRoleSwitch }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="gradient-indigo p-2 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MUN Debates</h1>
              <p className="text-xs text-gray-500">AI-Powered Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant={userRole === 'student' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch('student')}
              className="relative"
            >
              <Users className="h-4 w-4 mr-2" />
              Student View
            </Button>
            
            <Button
              variant={userRole === 'teacher' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch('teacher')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Teacher View
            </Button>

            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                {userTokens} Tokens
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-indigo-100 text-indigo-700">JD</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Debate Champion</p>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <div className="flex flex-col space-y-2">
              <Button
                variant={userRole === 'student' ? 'default' : 'outline'}
                onClick={() => onRoleSwitch('student')}
                className="justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Student View
              </Button>
              
              <Button
                variant={userRole === 'teacher' ? 'default' : 'outline'}
                onClick={() => onRoleSwitch('teacher')}
                className="justify-start"
              >
                <Crown className="h-4 w-4 mr-2" />
                Teacher View
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <Badge variant="secondary">{userTokens} Tokens</Badge>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
