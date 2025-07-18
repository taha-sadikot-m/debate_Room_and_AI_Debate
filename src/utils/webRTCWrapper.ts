/**
 * WebRTC Wrapper
 * This file provides a wrapper around simple-peer to ensure it works properly
 * in the browser environment with proper polyfills.
 */

// Apply required polyfills for WebRTC
import '../utils/polyfills';
import Peer from 'simple-peer';

// Create a factory function to instantiate Peer with proper error handling
export function createPeerConnection(options: {
  initiator: boolean;
  trickle?: boolean;
  stream?: MediaStream;
}) {
  try {
    // Ensure global is defined (required by simple-peer)
    if (typeof window !== 'undefined' && typeof (window as any).global === 'undefined') {
      (window as any).global = window;
    }

    return new Peer(options);
  } catch (error) {
    console.error('Error creating peer connection:', error);
    throw error;
  }
}

// Helper function to get user media
export async function getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }) {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}

export default Peer;
