
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hand, Clock, CheckCircle, XCircle } from 'lucide-react';

interface POIHandlerProps {
  poiText: string;
  isActive: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onTimeout: () => void;
}

const POIHandler = ({ poiText, isActive, onAccept, onDecline, onTimeout }: POIHandlerProps) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeout]);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(10);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <Card className="card-shadow border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hand className="h-5 w-5 text-orange-600" />
            <span className="text-orange-900">Point of Information</span>
          </div>
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            <Clock className="h-3 w-3 mr-1" />
            {timeLeft}s
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-3 rounded-lg border border-orange-200">
          <p className="text-orange-900 font-medium">{poiText}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={onAccept}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept POI
          </Button>
          <Button 
            onClick={onDecline}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </div>
        
        <p className="text-xs text-gray-600 text-center">
          You have {timeLeft} seconds to respond to this Point of Information
        </p>
      </CardContent>
    </Card>
  );
};

export default POIHandler;
