import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Apply persisted theme before first render to avoid flash
const saved = localStorage.getItem('devresume-theme')
try {
  const parsed = saved ? JSON.parse(saved) : null
  if (parsed?.state?.isDark) {
    document.documentElement.classList.add('dark')
  }
} catch {
  // ignore parse errors
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
