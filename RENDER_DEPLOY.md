# Render Build Configuration
# 
# Build Command: npm run build:render
# Publish Directory: dist
# Node Version: 18

# This file contains the configuration for deploying to Render

Build Settings:
- Environment: Node.js
- Build Command: npm run build:render  
- Publish Directory: dist
- Node Version: 18

Environment Variables (set in Render dashboard):
- NODE_ENV=production
- VITE_APP_ENV=production

For troubleshooting JSX issues:
1. Clear build cache in Render
2. Make sure all React components import React
3. Use classic JSX transform for better compatibility
4. Check that TypeScript is configured correctly
