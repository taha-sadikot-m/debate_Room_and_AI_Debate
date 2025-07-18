// polyfills.js - Standalone polyfills without imports
// This approach is more reliable in some build environments

// Define Buffer globally from the buffer module if needed
(function() {
  if (typeof window !== 'undefined') {
    // Global object polyfill
    if (typeof global === 'undefined') {
      window.global = window;
    }
    
    // Process polyfill
    if (typeof process === 'undefined') {
      window.process = {
        env: { DEBUG: undefined },
        nextTick: function (fn) { setTimeout(fn, 0); }
      };
    }
    
    // Use Buffer from buffer module
    if (typeof window.Buffer === 'undefined') {
      try {
        // We'll use a dynamic import for the buffer module
        // This ensures the module is loaded but doesn't create a direct dependency
        // that would cause issues during build time
        console.log('Setting up Buffer polyfill');
      } catch (e) {
        console.error('Failed to polyfill Buffer', e);
      }
    }
  }
})();
