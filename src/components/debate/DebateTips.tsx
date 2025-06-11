
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebateTips = () => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Quick Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>Speak clearly and maintain eye contact with the camera</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <p>Support your arguments with evidence and examples</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
            <p>Listen carefully to your opponent's points</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
            <p>Avoid using filler words like "um" and "uh"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebateTips;
