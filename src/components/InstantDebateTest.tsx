import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstantDebateTest = () => {
  const [currentStep, setCurrentStep] = useState<'menu' | 'setup' | 'debate'>('menu');
  const [debateConfig, setDebateConfig] = useState<any>(null);

  const handleStartSetup = () => {
    console.log('Starting setup...');
    setCurrentStep('setup');
  };

  const handleStartDebate = (config: any) => {
    console.log('Starting debate with config:', config);
    setDebateConfig(config);
    setCurrentStep('debate');
  };

  const handleBack = () => {
    setCurrentStep('setup');
  };

  const handleExit = () => {
    setCurrentStep('menu');
    setDebateConfig(null);
  };

  if (currentStep === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Instant Debate Test</h1>
        <Button onClick={handleStartSetup} size="lg">
          🤖 Start Instant Debate
        </Button>
      </div>
    );
  }

  if (currentStep === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Debate Setup (Test)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>This is a simplified test setup.</p>
              <Button 
                onClick={() => handleStartDebate({
                  topic: 'Should AI replace human teachers?',
                  userPosition: 'for',
                  firstSpeaker: 'user'
                })}
              >
                Start Test Debate
              </Button>
              <Button onClick={handleExit} variant="outline">
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'debate') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Debate Room (Test)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p><strong>Topic:</strong> {debateConfig?.topic}</p>
              <p><strong>Your Position:</strong> {debateConfig?.userPosition}</p>
              <p><strong>First Speaker:</strong> {debateConfig?.firstSpeaker}</p>
              <p className="text-green-600 font-semibold">✅ Debate functionality is working!</p>
              <div className="flex space-x-2">
                <Button onClick={handleBack} variant="outline">
                  Back to Setup
                </Button>
                <Button onClick={handleExit}>
                  Exit to Menu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default InstantDebateTest;
