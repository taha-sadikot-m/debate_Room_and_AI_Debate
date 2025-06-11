
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Globe } from 'lucide-react';

interface LanguageSelectionProps {
  onLanguageSelect: (language: string) => void;
  onBack: () => void;
}

const LanguageSelection = ({ onLanguageSelect, onBack }: LanguageSelectionProps) => {
  const indianLanguages = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
    { code: 'en', name: 'English', native: 'English' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Select Your Debate Language</h1>
          <p className="text-gray-600 mt-2">Choose the language you want to debate in</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indianLanguages.map((language) => (
          <Card 
            key={language.code} 
            className="card-shadow hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onLanguageSelect(language.code)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-indigo rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {language.name}
                  </h3>
                  <p className="text-lg text-gray-600">{language.native}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Select Language
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelection;
