import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppQueryClientProvider from './providers/AppQueryClientProvider.jsx'
import AuthProvider from './features/auth/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppQueryClientProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppQueryClientProvider>
  </StrictMode>,
)
