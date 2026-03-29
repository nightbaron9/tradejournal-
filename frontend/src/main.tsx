import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './app/AppContext'
import { createAppConfig } from './app/config'
import './index.css'
import App from './App.tsx'

const config = createAppConfig()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider config={config}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
