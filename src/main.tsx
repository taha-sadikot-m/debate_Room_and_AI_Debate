// Import polyfills before anything else
import './utils/polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client'
// Temporarily use demo app for development
import App from './components/App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
