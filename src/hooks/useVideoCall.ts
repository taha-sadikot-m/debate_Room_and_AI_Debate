import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createPeerConnection, getUserMedia } from '@/utils/webRTCWrapper';

interface UseVideoCallOptions {
  roomId: string;
  userId: string;
  isObserver?: boolean; // Add observer mode support
  onRemoteStreamReceived?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

export const useVideoCall = ({ roomId, userId, isObserver = false, onRemoteStreamReceived, onError }: UseVideoCallOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isPeerInitiator, setIsPeerInitiator] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  const peerRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Connect local video ref to stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef.current]);
  
  // Connect remote video ref to stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      
      // Notify parent component
      if (onRemoteStreamReceived) {
        onRemoteStreamReceived(remoteStream);
      }
    }
  }, [remoteStream, remoteVideoRef.current]);
  
  // Initialize or destroy WebRTC connection based on camera state
  useEffect(() => {
    if (isCameraOn) {
      initializeCamera();
    } else {
      destroyPeerConnection();
    }
    
    return () => {
      destroyPeerConnection();
    };
  }, [isCameraOn]);
  
  // Initialize camera access (modified for observer mode)
  const initializeCamera = async () => {
    try {
      // If observer mode, request camera with audio muted
      const constraints = isObserver 
        ? { video: true, audio: false } 
        : { video: true, audio: true };
        
      const stream = await getUserMedia(constraints);
      setLocalStream(stream);
      
      // Notify Supabase that camera is on
      if (roomId) {
        const roomChannel = supabase.channel(`debate-room-${roomId}`);
        await roomChannel.send({
          type: 'broadcast',
          event: 'camera-on',
          payload: { 
            userId,
            isObserver,
            timestamp: Date.now() 
          },
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraOn(false);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to access camera'));
      }
    }
  };
  
  // Toggle camera on/off
  const toggleCamera = async () => {
    try {
      if (isCameraOn) {
        // Turn off camera
        setIsCameraOn(false);
        
        // Notify peers
        if (roomId) {
          const roomChannel = supabase.channel(`debate-room-${roomId}`);
          await roomChannel.send({
            type: 'broadcast',
            event: 'camera-off',
            payload: { 
              userId,
              timestamp: Date.now() 
            },
          });
        }
      } else {
        // Turn on camera
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to toggle camera'));
      }
    }
  };
  
  // Initialize a WebRTC peer connection as the initiator
  const initiatePeerConnection = (stream: MediaStream) => {
    try {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      setIsPeerInitiator(true);
      
      const peer = createPeerConnection({
        initiator: true,
        trickle: true,
        stream
      });
      
      attachPeerEvents(peer);
      peerRef.current = peer;
    } catch (error) {
      console.error('Failed to initiate peer connection:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to initiate peer connection'));
      }
    }
  };
  
  // Handle a received WebRTC offer by creating a new peer connection
  const handleReceivedOffer = (offer: any) => {
    try {
      if (!localStream) {
        // If no local stream, we need to get one first
        toggleCamera();
        return;
      }
      
      // Create a new peer as the receiver
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      setIsPeerInitiator(false);
      
      const peer = createPeerConnection({
        initiator: false,
        trickle: true,
        stream: localStream
      });
      
      attachPeerEvents(peer);
      
      // Process the received offer
      peer.signal(offer);
      peerRef.current = peer;
    } catch (error) {
      console.error('Failed to handle received offer:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to handle received offer'));
      }
    }
  };
  
  // Handle a received WebRTC answer
  const handleReceivedAnswer = (answer: any) => {
    try {
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    } catch (error) {
      console.error('Failed to handle received answer:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to handle received answer'));
      }
    }
  };
  
  // Handle ICE candidates
  const handleIceCandidate = (candidate: any) => {
    try {
      if (peerRef.current) {
        peerRef.current.signal(candidate);
      }
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
    }
  };
  
  // Attach event handlers to peer connection
  const attachPeerEvents = (peer: any) => {
    peer.on('signal', async (data: any) => {
      // Send signal to remote peer via Supabase
      if (roomId) {
        const roomChannel = supabase.channel(`debate-room-${roomId}`);
        
        if (data.type === 'offer') {
          await roomChannel.send({
            type: 'broadcast',
            event: 'webrtc-offer',
            payload: { 
              userId,
              offer: data,
              timestamp: Date.now() 
            },
          });
        } else if (data.type === 'answer') {
          await roomChannel.send({
            type: 'broadcast',
            event: 'webrtc-answer',
            payload: { 
              userId,
              answer: data,
              timestamp: Date.now() 
            },
          });
        } else if (data.candidate) {
          await roomChannel.send({
            type: 'broadcast',
            event: 'webrtc-ice',
            payload: { 
              userId,
              candidate: data,
              timestamp: Date.now() 
            },
          });
        }
      }
    });
    
    peer.on('connect', () => {
      console.log('WebRTC peer connection established');
      setIsConnected(true);
    });
    
    peer.on('stream', (remoteMediaStream: MediaStream) => {
      console.log('Received remote stream');
      setRemoteStream(remoteMediaStream);
    });
    
    peer.on('close', () => {
      console.log('WebRTC peer connection closed');
      setIsConnected(false);
      setRemoteStream(null);
    });
    
    peer.on('error', (err: Error) => {
      console.error('WebRTC peer connection error:', err);
      setIsConnected(false);
      if (onError) {
        onError(err);
      }
    });
  };
  
  // Clean up resources
  const destroyPeerConnection = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    setRemoteStream(null);
    setIsConnected(false);
  };
  
  // Cleanup function for component unmount
  const cleanup = () => {
    destroyPeerConnection();
    
    // Notify peers that camera is off
    if (isCameraOn && roomId) {
      const roomChannel = supabase.channel(`debate-room-${roomId}`);
      roomChannel.send({
        type: 'broadcast',
        event: 'camera-off',
        payload: { 
          userId,
          timestamp: Date.now() 
        },
      }).catch(err => console.error('Error broadcasting camera off:', err));
    }
  };
  
  return {
    localStream,
    remoteStream,
    isCameraOn,
    isConnected,
    toggleCamera,
    initiatePeerConnection,
    handleReceivedOffer,
    handleReceivedAnswer,
    handleIceCandidate,
    localVideoRef,
    remoteVideoRef,
    cleanup
  };
};
