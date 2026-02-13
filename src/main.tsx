import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import OnboardWalletProvider from './providers/OnboardWalletProvider.tsx'
import { Web3Provider } from './providers/Web3Provider.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnboardWalletProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </OnboardWalletProvider>
  </StrictMode>,
)
