import { createRoot } from 'react-dom/client'
// Temporarily use demo app for development
import App from './components/App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
