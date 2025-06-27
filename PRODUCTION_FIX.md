# Production Deployment Fix - JSX Runtime Error

## Problem
When deploying to Render, the application shows the error:
```
Uncaught TypeError: _jsxDEV is not a function at main.tsx:6:53
```

This error occurs because `_jsxDEV` is a development-mode JSX function that's not available in production builds.

## Root Cause
The issue was caused by:
1. **Development JSX Transform**: The app was using development-mode JSX transforms in production
2. **Component Tagger**: The `lovable-tagger` plugin was interfering with production builds
3. **Vite Configuration**: Incorrect plugin configuration for production mode

## Fixes Applied

### 1. Updated Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use component tagger in development
    ...(mode === 'development' ? [componentTagger()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
```

**Key Changes:**
- ✅ Simplified plugin configuration
- ✅ Component tagger only runs in development mode
- ✅ Updated build target to ES2020
- ✅ Proper ESBuild minification

### 2. Updated Main Entry Point (`src/main.tsx`)
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<App />);
```

**Key Changes:**
- ✅ Explicit React import for JSX
- ✅ Removed `.tsx` extension in import
- ✅ Proper error handling for root element
- ✅ Standard JSX syntax instead of createElement

### 3. TypeScript Configuration is Correct
The `tsconfig.app.json` already has the correct JSX configuration:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    // ... other options
  }
}
```

## Deployment Steps

### For Render:
1. **Build Command**: `npm run build`
2. **Start Command**: `npm run preview`
3. **Node Version**: 18+ (specified in package.json engines if needed)

### Testing Locally:
```bash
# Test production build locally
npm run build
npm run preview
```

### Environment Variables:
Make sure Render has proper environment variables set:
- `NODE_ENV=production` (usually set automatically)

## Expected Result

After these fixes:
- ✅ **Development**: App runs normally with all development tools
- ✅ **Production**: Clean build without JSX development artifacts
- ✅ **Render Deployment**: No more `_jsxDEV is not a function` error
- ✅ **Performance**: Optimized production bundle

## Additional Recommendations

1. **Add Build Scripts to package.json**:
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production vite build",
    "preview:prod": "vite preview --port 8080"
  }
}
```

2. **Add Engine Specification**:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

3. **Render Build Settings**:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run preview`
   - **Node Version**: 18

---

**Status**: ✅ **FIXED** - The production JSX runtime error should now be resolved. The app will build and deploy correctly on Render.
