
import { useState } from 'react';

interface AIVoiceOptions {
  language: string;
  text: string;
  style?: 'formal' | 'conversational' | 'parliamentary';
}

export const useAIVoice = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIVoice = async ({ language, text, style = 'conversational' }: AIVoiceOptions) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      
      // Voice selection based on language
      let selectedVoice = null;
      
      switch (language) {
        case 'hi':
          selectedVoice = voices.find(voice => 
            voice.lang.includes('hi') || voice.lang.includes('hi-IN')
          );
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          break;
          
        case 'ta':
          selectedVoice = voices.find(voice => 
            voice.lang.includes('ta') || voice.lang.includes('ta-IN')
          );
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          break;
          
        case 'en':
        default:
          // Try to find Indian English voice first
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en-IN') || 
            voice.name.toLowerCase().includes('indian') ||
            voice.name.toLowerCase().includes('ravi') ||
            voice.name.toLowerCase().includes('aditi')
          );
          
          // Fallback to British accent
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => 
              voice.lang.includes('en-GB') || voice.lang.includes('en-AU')
            );
          }
          
          // Apply style-specific settings
          if (style === 'parliamentary') {
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
          } else if (style === 'formal') {
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
          } else {
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
          }
          break;
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsGenerating(false);
      };
      
      utterance.onerror = () => {
        setIsGenerating(false);
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error generating AI voice:', error);
      setIsGenerating(false);
    }
  };

  const stopAIVoice = () => {
    speechSynthesis.cancel();
    setIsGenerating(false);
  };

  return {
    generateAIVoice,
    stopAIVoice,
    isGenerating
  };
};
