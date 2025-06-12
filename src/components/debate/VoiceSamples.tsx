
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';

interface VoiceSample {
  name: string;
  language: string;
  style: string;
  text: string;
  voiceSettings: {
    rate: number;
    pitch: number;
    volume: number;
  };
}

const VoiceSamples = () => {
  const voiceSamples: VoiceSample[] = [
    {
      name: "Donald Trump Style",
      language: "English",
      style: "Confident Political",
      text: "Let me tell you, this renewable energy debate is huge, tremendous. We need to make America energy independent, and we need to do it fast. The best deals, the best technology - that's what we need.",
      voiceSettings: { rate: 0.9, pitch: 0.8, volume: 0.9 }
    },
    {
      name: "Shashi Tharoor Style", 
      language: "English",
      style: "Eloquent Diplomatic",
      text: "The inexorable march towards sustainable energy is not merely an environmental imperative, but a testament to human ingenuity and our collective responsibility towards posterity.",
      voiceSettings: { rate: 0.85, pitch: 1.1, volume: 0.8 }
    },
    {
      name: "Indian Parliamentary",
      language: "Hindi",
      style: "Formal Parliamentary",
      text: "माननीय सभापति जी, नवीकरणीय ऊर्जा का प्रश्न केवल पर्यावरण का नहीं, बल्कि हमारे देश की आर्थिक स्वतंत्रता का भी है।",
      voiceSettings: { rate: 0.8, pitch: 1.0, volume: 0.85 }
    },
    {
      name: "French Diplomatic",
      language: "French", 
      style: "Diplomatic French",
      text: "Mesdames et messieurs, la transition énergétique représente un défi majeur pour notre civilisation. Nous devons agir avec détermination et sagesse.",
      voiceSettings: { rate: 0.85, pitch: 1.05, volume: 0.8 }
    },
    {
      name: "Tamil Academic",
      language: "Tamil",
      style: "Academic Tamil",
      text: "மதிப்பிற்குரிய நண்பர்களே, புதுப்பிக்கத்தக்க ஆற்றல் நமது எதிர்காலத்திற்கு மிகவும் முக்கியமானது. நாம் இதை தீவிரமாக கருத வேண்டும்.",
      voiceSettings: { rate: 0.8, pitch: 1.0, volume: 0.85 }
    }
  ];

  const playVoiceSample = (sample: VoiceSample) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(sample.text);
      
      // Find appropriate voice based on language
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (sample.language === 'English') {
        if (sample.name.includes('Trump')) {
          // Try to find American voice
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en-US') && 
            (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('david'))
          );
        } else {
          // Try to find British/Indian voice for Tharoor style
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en-GB') || voice.lang.includes('en-IN')
          );
        }
      } else if (sample.language === 'Hindi') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('hi') || voice.lang.includes('hi-IN')
        );
      } else if (sample.language === 'French') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('fr') || voice.lang.includes('fr-FR')
        );
      } else if (sample.language === 'Tamil') {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('ta') || voice.lang.includes('ta-IN')
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = sample.voiceSettings.rate;
      utterance.pitch = sample.voiceSettings.pitch;
      utterance.volume = sample.voiceSettings.volume;
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5 text-purple-600" />
          <span>AI Voice Samples</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Listen to different AI voice styles and languages that will be used during debates
        </p>
        
        <div className="space-y-3">
          {voiceSamples.map((sample, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{sample.name}</h4>
                  <p className="text-xs text-gray-500">{sample.language} • {sample.style}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playVoiceSample(sample)}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  Play
                </Button>
              </div>
              <p className="text-xs text-gray-600 italic">
                "{sample.text.substring(0, 100)}..."
              </p>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            * Voice quality depends on your browser's text-to-speech capabilities. Some languages may not be available on all devices.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSamples;
