
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, Globe, MapPin } from 'lucide-react';
import { munCommittees, liveMunSessions, MunCommittee, LiveMunSession } from '@/data/munCommittees';

interface MunCommitteeSelectionProps {
  onCommitteeSelect: (committee: MunCommittee) => void;
  onJoinLiveSession: (session: LiveMunSession) => void;
  onBack: () => void;
}

const MunCommitteeSelection = ({ onCommitteeSelect, onJoinLiveSession, onBack }: MunCommitteeSelectionProps) => {
  const internationalCommittees = munCommittees.filter(c => c.type === 'international');
  const indianCommittees = munCommittees.filter(c => c.type === 'indian');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏛️ Choose Your MUN Committee</h1>
          <p className="text-gray-600 mt-2">Select a committee and join the global conversation</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Dashboard
        </Button>
      </div>

      {/* Live Sessions */}
      <Card className="card-shadow bg-gradient-to-br from-green-50 to-white border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>🔴 Join Live MUN Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveMunSessions.map((session) => (
              <div key={session.id} className="p-4 bg-white border border-green-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{session.committee}</h4>
                  <Badge className="bg-green-100 text-green-700">Live Soon</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{session.agenda}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{session.startTime}</span>
                  <span>{session.participants}/{session.maxParticipants} joined</span>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onJoinLiveSession(session)}
                >
                  Join Session
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* International Committees */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">🌍 International Committees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internationalCommittees.map((committee) => (
            <Card 
              key={committee.id} 
              className="card-shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onCommitteeSelect(committee)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{committee.name}</CardTitle>
                    <p className="text-sm text-gray-600 font-medium">{committee.fullName}</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {committee.rulesOfProcedure}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{committee.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{committee.participants} members</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Current Agendas:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {committee.currentAgendas.slice(0, 2).map((agenda, index) => (
                        <li key={index}>• {agenda}</li>
                      ))}
                      {committee.currentAgendas.length > 2 && (
                        <li>• +{committee.currentAgendas.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Indian Parliamentary Committees */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">🇮🇳 Indian Parliamentary Committees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indianCommittees.map((committee) => (
            <Card 
              key={committee.id} 
              className="card-shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onCommitteeSelect(committee)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{committee.name}</CardTitle>
                    <p className="text-sm text-gray-600 font-medium">{committee.fullName}</p>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {committee.rulesOfProcedure}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{committee.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{committee.participants} seats</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Current Agendas:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {committee.currentAgendas.slice(0, 2).map((agenda, index) => (
                        <li key={index}>• {agenda}</li>
                      ))}
                      {committee.currentAgendas.length > 2 && (
                        <li>• +{committee.currentAgendas.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MunCommitteeSelection;
