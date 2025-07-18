/**
 * Buffer Polyfill for WebRTC
 * This file provides a browser-compatible polyfill for Node.js Buffer
 * which is required by libraries like simple-peer
 */

// Apply basic browser polyfills needed for WebRTC
export function applyWebRTCPolyfills() {
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
}

// Execute polyfills immediately
applyWebRTCPolyfills();
