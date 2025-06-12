import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Mic, 
  MicOff, 
  Users, 
  Clock,
  Flag,
  Gavel,
  MessageSquare,
  AlertTriangle,
  Globe,
  Vote,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { MunCommittee, LiveMunSession } from '@/data/munCommittees';

interface MunArenaProps {
  committee?: MunCommittee;
  liveSession?: LiveMunSession;
  onExit: () => void;
  onBackToCommittees: () => void;
}

const MunArena = ({ committee, liveSession, onExit, onBackToCommittees }: MunArenaProps) => {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isInSpeakerQueue, setIsInSpeakerQueue] = useState(false);
  const [currentMode, setCurrentMode] = useState<'general' | 'moderated' | 'unmoderated'>('general');
  const [micStatus, setMicStatus] = useState(false);

  // Update countries based on committee type
  const getCountriesForCommittee = () => {
    if (committee?.type === 'indian') {
      return [
        { name: 'BJP', delegate: 'You', status: 'active', avatar: '🇮🇳' },
        { name: 'INC', delegate: 'Rahul G.', status: 'speaking', avatar: '✋' },
        { name: 'AAP', delegate: 'Arvind K.', status: 'active', avatar: '🧹' },
        { name: 'TMC', delegate: 'Mamata B.', status: 'queued', avatar: '🌿' },
        { name: 'DMK', delegate: 'Stalin M.', status: 'active', avatar: '☀️' },
        { name: 'SP', delegate: 'Akhilesh Y.', status: 'active', avatar: '🚲' },
        { name: 'BSP', delegate: 'Mayawati', status: 'inactive', avatar: '🐘' },
        { name: 'BJD', delegate: 'Naveen P.', status: 'active', avatar: '🦌' },
      ];
    }
    
    return [
      { name: 'United States', delegate: 'You', status: 'active', avatar: '🇺🇸' },
      { name: 'United Kingdom', delegate: 'Sarah M.', status: 'speaking', avatar: '🇬🇧' },
      { name: 'China', delegate: 'Wei L.', status: 'active', avatar: '🇨🇳' },
      { name: 'Germany', delegate: 'Hans K.', status: 'queued', avatar: '🇩🇪' },
      { name: 'France', delegate: 'Marie D.', status: 'active', avatar: '🇫🇷' },
      { name: 'Japan', delegate: 'Akira T.', status: 'active', avatar: '🇯🇵' },
      { name: 'Brazil', delegate: 'Carlos R.', status: 'inactive', avatar: '🇧🇷' },
      { name: 'Russia', delegate: 'Dimitri V.', status: 'active', avatar: '🇷🇺' },
    ];
  };

  const countries = getCountriesForCommittee();

  const speakerQueue = [
    { country: 'United Kingdom', delegate: 'Sarah M.', timeRemaining: 180 },
    { country: 'Germany', delegate: 'Hans K.', timeRemaining: 180 },
    { country: 'China', delegate: 'Wei L.', timeRemaining: 180 },
  ];

  const getCurrentAgenda = () => {
    if (liveSession) return liveSession.agenda;
    if (committee) return committee.currentAgendas[0];
    return 'Climate Change Mitigation Strategies';
  };

  const getCommitteeTitle = () => {
    if (liveSession) return `${liveSession.committee} Live Session`;
    if (committee) return `${committee.name} Simulation`;
    return 'MUN General Assembly';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="gradient-indigo p-3 rounded-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getCommitteeTitle()}</h1>
            <p className="text-gray-600">{getCurrentAgenda()}</p>
            {committee && (
              <p className="text-sm text-gray-500">{committee.fullName} • {committee.rulesOfProcedure} Rules</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {liveSession && (
            <Badge variant="secondary" className="bg-red-50 text-red-700">
              🔴 Live Session
            </Badge>
          )}
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            Session Active
          </Badge>
          <Button variant="outline" onClick={onBackToCommittees}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Committees
          </Button>
          <Button variant="outline" onClick={onExit}>Exit Session</Button>
        </div>
      </div>

      {/* Crisis Alert - Updated for committee */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">
                {committee?.type === 'indian' 
                  ? 'Breaking: Opposition walks out over digital privacy concerns' 
                  : 'Breaking: Economic Sanctions Announced'
                }
              </h3>
              <p className="text-sm text-orange-800">
                {committee?.type === 'indian'
                  ? 'Parliament session disrupted. Delegates must address privacy vs security balance.'
                  : 'Major economic sanctions have been imposed affecting global trade relations. Delegates must adjust their positions accordingly.'
                }
              </p>
            </div>
            <Badge variant="destructive">
              {committee?.type === 'indian' ? 'Parliamentary Alert' : 'Crisis Update'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Country/Party Seats */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>{committee?.type === 'indian' ? 'Party Seats' : 'Delegate Seats'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      country.name === selectedCountry
                        ? 'border-indigo-500 bg-indigo-50'
                        : country.status === 'speaking'
                        ? 'border-green-500 bg-green-50'
                        : country.status === 'queued'
                        ? 'border-yellow-500 bg-yellow-50'
                        : country.status === 'inactive'
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCountry(country.name)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{country.avatar}</div>
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {country.delegate}
                      </div>
                      <div className="mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            country.status === 'speaking'
                              ? 'bg-green-100 text-green-700'
                              : country.status === 'queued'
                              ? 'bg-yellow-100 text-yellow-700'
                              : country.status === 'inactive'
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {country.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Agenda/Resolution */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>{committee?.type === 'indian' ? 'Current Bill' : 'Current Resolution'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{getCurrentAgenda()}</h4>
                      <p className="text-sm text-gray-500">
                        {committee?.type === 'indian' ? 'Bill No. 2024/001' : 'Resolution A/78/123'}
                      </p>
                    </div>
                    <Badge variant="default">Under Discussion</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">12</div>
                      <div className="text-xs text-gray-500">In Favor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">3</div>
                      <div className="text-xs text-gray-500">Against</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">2</div>
                      <div className="text-xs text-gray-500">Abstain</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Controls */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-yellow-600" />
                <span>Session Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={currentMode === 'general' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('general')}
                >
                  General
                </Button>
                <Button
                  variant={currentMode === 'moderated' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('moderated')}
                >
                  Moderated
                </Button>
                <Button
                  variant={currentMode === 'unmoderated' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('unmoderated')}
                >
                  Unmoderated
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={micStatus ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setMicStatus(!micStatus)}
                  className="flex-1"
                >
                  {micStatus ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {micStatus ? 'Mute' : 'Unmute'}
                </Button>
                
                <Button
                  variant={isInSpeakerQueue ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setIsInSpeakerQueue(!isInSpeakerQueue)}
                  className="flex-1"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isInSpeakerQueue ? 'Leave Queue' : 'Join Queue'}
                </Button>
              </div>

              <Button className="w-full" variant="outline">
                <Vote className="h-4 w-4 mr-2" />
                Cast Vote
              </Button>
            </CardContent>
          </Card>

          {/* Speaker Queue */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span>Speaker Queue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {speakerQueue.map((speaker, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{speaker.country}</p>
                        <p className="text-xs text-gray-500">{speaker.delegate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">3:00</span>
                    </div>
                  </div>
                ))}
                
                {isInSpeakerQueue && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">{speakerQueue.length + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-blue-900">{selectedCountry}</p>
                        <p className="text-xs text-blue-700">You</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Queued
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Country Position */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flag className="h-5 w-5 text-red-600" />
                <span>Your Position</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">
                    {committee?.type === 'indian' ? `Representing: ${selectedCountry} Party` : `Representing: ${selectedCountry}`}
                  </h4>
                  <p className="text-sm text-blue-800">
                    {committee?.type === 'indian' 
                      ? `As a ${selectedCountry} representative, you advocate for transparent digital governance while ensuring citizen privacy protection and constitutional rights.`
                      : `As the delegate for ${selectedCountry}, you support innovative climate solutions while maintaining economic stability and international cooperation.`
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">Key Talking Points:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {committee?.type === 'indian' ? (
                      <>
                        <li>• Data protection and privacy rights</li>
                        <li>• Digital infrastructure development</li>
                        <li>• Cybersecurity framework</li>
                        <li>• Constitutional compliance</li>
                      </>
                    ) : (
                      <>
                        <li>• Technology transfer for developing nations</li>
                        <li>• Carbon pricing mechanisms</li>
                        <li>• Green energy investment frameworks</li>
                        <li>• Climate adaptation funding</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MunArena;
