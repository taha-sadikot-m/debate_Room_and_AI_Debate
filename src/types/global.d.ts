import { LiveDebateTopic } from '@/data/liveDebateTopics';

declare global {
  interface Window {
    selectedDebateTopic?: LiveDebateTopic;
  }
}

export {};
