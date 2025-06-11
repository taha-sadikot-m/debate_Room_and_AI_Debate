
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';

const AudioControls = () => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5" />
          <span>Audio Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full">
          Test Microphone
        </Button>
        <Button variant="outline" className="w-full">
          Adjust Volume
        </Button>
      </CardContent>
    </Card>
  );
};

export default AudioControls;
