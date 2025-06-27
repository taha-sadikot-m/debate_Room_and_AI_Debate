#!/bin/bash

# Deploy script for Render
echo "🚀 Starting deployment..."

# Clean previous builds
rm -rf dist
rm -rf node_modules/.vite

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build complete! Deploy folder: ./dist"

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Deployment ready!"
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi
