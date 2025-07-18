/**
 * Polyfills for libraries that expect Node.js globals in the browser
 * This is a comprehensive polyfill file for WebRTC and other Node.js dependencies
 */

// Apply all necessary browser polyfills
export function applyPolyfills() {
  if (typeof window !== 'undefined') {
    // Global object polyfill
    if (typeof (window as any).global === 'undefined') {
      (window as any).global = window;
    }
    
    // Buffer polyfill
    if (typeof (window as any).Buffer === 'undefined') {
      try {
        // Import Buffer from the 'buffer' package
        const { Buffer } = require('buffer');
        (window as any).Buffer = Buffer;
      } catch (e) {
        console.warn('Failed to load Buffer polyfill', e);
      }
    }
    
    // Process polyfill
    if (typeof (window as any).process === 'undefined') {
      (window as any).process = {
        env: { 
          DEBUG: undefined,
          NODE_ENV: process.env.NODE_ENV 
        },
        nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
        version: '',
      };
    }
  }
}

// Execute polyfills immediately
applyPolyfills();
