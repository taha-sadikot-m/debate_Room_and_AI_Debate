
import { useState, useEffect } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        setVoices(speechSynthesis.getVoices());
      };

      updateVoices();
      speechSynthesis.addEventListener('voiceschanged', updateVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    
    if (options.voice) {
      utterance.voice = options.voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isSupported && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const cancel = () => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    isSupported,
    voices
  };
};
