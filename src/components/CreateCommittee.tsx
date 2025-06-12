
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings, Users, Globe } from 'lucide-react';

interface CreateCommitteeProps {
  onBack: () => void;
}

const CreateCommittee = ({ onBack }: CreateCommitteeProps) => {
  const [committeeName, setCommitteeName] = useState('');
  const [committeeType, setCommitteeType] = useState('');
  const [agenda, setAgenda] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [procedureType, setProcedureType] = useState('');

  const handleCreateCommittee = () => {
    // Implementation for creating committee
    console.log('Creating committee:', {
      committeeName,
      committeeType,
      agenda,
      maxParticipants,
      procedureType
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏛️ Create Committee</h1>
          <p className="text-gray-600 mt-2">Set up your own MUN committee session</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <span>Committee Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="committee-name">Committee Name</Label>
              <Input
                id="committee-name"
                placeholder="e.g., UN Security Council"
                value={committeeName}
                onChange={(e) => setCommitteeName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="committee-type">Committee Type</Label>
              <Select value={committeeType} onValueChange={setCommitteeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select committee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsc">UN Security Council</SelectItem>
                  <SelectItem value="unga">UN General Assembly</SelectItem>
                  <SelectItem value="ecosoc">UN Economic and Social Council</SelectItem>
                  <SelectItem value="unhrc">UN Human Rights Council</SelectItem>
                  <SelectItem value="loksabha">Lok Sabha</SelectItem>
                  <SelectItem value="rajyasabha">Rajya Sabha</SelectItem>
                  <SelectItem value="custom">Custom Committee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedure-type">Rules of Procedure</Label>
              <Select value={procedureType} onValueChange={setProcedureType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select procedure type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="una-usa">UNA-USA Rules</SelectItem>
                  <SelectItem value="indian-parliamentary">Indian Parliamentary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-participants">Maximum Participants</Label>
              <Input
                id="max-participants"
                type="number"
                placeholder="e.g., 15"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda">Committee Agenda</Label>
            <Textarea
              id="agenda"
              placeholder="Describe the main agenda items for this committee session..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Globe className="h-5 w-5" />
              <span>Session Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2h">2 Hours</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="8h">Full Day (8 Hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="datetime-local" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Users className="h-5 w-5" />
              <span>Participant Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Invitation Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select invitation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (Anyone can join)</SelectItem>
                  <SelectItem value="private">Private (Invitation only)</SelectItem>
                  <SelectItem value="school">School/Institution only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Country Assignment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="How to assign countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random Assignment</SelectItem>
                  <SelectItem value="choice">Participant Choice</SelectItem>
                  <SelectItem value="manual">Manual Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleCreateCommittee}
          className="gradient-indigo text-white"
          size="lg"
        >
          Create Committee
        </Button>
      </div>
    </div>
  );
};

export default CreateCommittee;
