/**
 * React WebRTC Hooks
 * This file provides React-specific hooks for WebRTC functionality
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Make sure the global objects needed by WebRTC are available
if (typeof window !== 'undefined') {
  // Global object polyfill
  if (typeof window.global === 'undefined') {
    (window as any).global = window;
  }
  
  // Process polyfill
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = {
      env: { DEBUG: undefined },
      nextTick: (fn: Function) => setTimeout(fn, 0),
    };
  }
}

// Define the interface for our video calling hook
interface UseVideoCallOptions {
  roomId: string;
  userId: string;
  onRemoteStreamReceived?: (stream: MediaStream) => void;
  onError?: (error: any) => void;
}

interface VideoCallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraOn: boolean;
  error: any;
}

export function useVideoCall({ roomId, userId, onRemoteStreamReceived, onError }: UseVideoCallOptions) {
  const [state, setState] = useState<VideoCallState>({
    localStream: null,
    remoteStream: null,
    isCameraOn: false,
    error: null,
  });
  
  const peerRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Clean up function to stop all media tracks and close connections
  const cleanup = useCallback(() => {
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (err) {
        console.error('Error destroying peer connection:', err);
      }
    }
    
    setState(prev => ({
      ...prev,
      localStream: null,
      isCameraOn: false,
    }));
  }, [state.localStream]);
  
  // Effect to clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  // Function to toggle camera on/off
  const toggleCamera = useCallback(async () => {
    try {
      if (state.isCameraOn) {
        // Turn off camera
        cleanup();
      } else {
        // Turn on camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // Set local stream
        setState(prev => ({
          ...prev,
          localStream: stream,
          isCameraOn: true,
          error: null,
        }));
        
        // Set video element's srcObject
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      setState(prev => ({
        ...prev,
        error,
      }));
      if (onError) onError(error);
    }
  }, [state.isCameraOn, cleanup, onError]);
  
  // Create a simplified interface for signaling between peers
  // In a real app, you'd use your own signaling mechanism (e.g., through Supabase)
  const createSignalingChannel = () => {
    // This is a simplified version - you'll implement real signaling
    // with your backend or Supabase
    return {
      sendSignal: (signal: any) => {
        console.log('Sending signal:', signal);
        // In real implementation: send to server/Supabase
      },
      onSignal: (callback: (signal: any) => void) => {
        console.log('Setting up signal handler');
        // In real implementation: listen for signals from server/Supabase
      },
    };
  };
  
  return {
    ...state,
    localVideoRef,
    remoteVideoRef,
    toggleCamera,
    cleanup,
  };
}
