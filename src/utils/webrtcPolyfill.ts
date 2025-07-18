// This file provides polyfills for Node.js globals that are needed by simple-peer
// and other WebRTC-related libraries but are not available in the browser environment

// Polyfill for global (used by simple-peer)
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  (window as any).global = window;
}

// Polyfill for process.nextTick
if (typeof window !== 'undefined' && typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: { DEBUG: undefined },
    nextTick: (fn: Function) => {
      setTimeout(fn, 0);
    },
  };
}

// Polyfill for Buffer
if (typeof window !== 'undefined') {
  try {
    // Direct import of buffer to ensure it's loaded
    import('buffer/').then(buffer => {
      (window as any).Buffer = buffer.Buffer;
    }).catch(err => {
      console.error('Error loading buffer polyfill:', err);
    });
  } catch (err) {
    console.error('Error setting up Buffer polyfill:', err);
  }
}
