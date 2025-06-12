
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Users } from 'lucide-react';

interface ProcedureSelectionProps {
  onProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
  onBack: () => void;
}

const ProcedureSelection = ({ onProcedureSelect, onBack }: ProcedureSelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🌐 Choose MUN Procedure</h1>
          <p className="text-gray-600 mt-2">Select your preferred rules of procedure</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card 
          className="card-shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => onProcedureSelect('UNA-USA')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">UNA-USA Rules</CardTitle>
            <Badge className="mt-2 bg-blue-100 text-blue-700">International Standard</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Standard United Nations Association rules used in international MUN conferences
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Key Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Moderated & Unmoderated Caucuses</li>
                <li>• Points of Information (POI)</li>
                <li>• Roll Call Voting</li>
                <li>• Motion to Set Agenda</li>
                <li>• Speaker's List</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => onProcedureSelect('Indian Parliamentary')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto bg-orange-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Indian Parliamentary</CardTitle>
            <Badge className="mt-2 bg-orange-100 text-orange-700">Lok Sabha / Rajya Sabha</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Parliamentary procedure based on Indian Lok Sabha and Rajya Sabha formats
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Key Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Speaker List & Whip Orders</li>
                <li>• Yielding Time</li>
                <li>• Indian Motion Formats</li>
                <li>• Question Hour</li>
                <li>• Division of House</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcedureSelection;
