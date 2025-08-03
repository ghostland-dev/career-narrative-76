import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { trackPerformance, registerServiceWorker } from './utils/production.ts'

// Initialize performance tracking and service worker
trackPerformance();
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
