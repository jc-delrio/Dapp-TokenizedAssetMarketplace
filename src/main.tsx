import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import './index.css'
import App from './App.tsx'
import OnboardWalletProvider from './contracts/providers/OnboardWalletProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnboardWalletProvider>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </OnboardWalletProvider>
  </StrictMode>,
)
