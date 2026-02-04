import './App.css'
import { useWallet } from './hooks/useWallet'
import ConnectWallet from './components/Wallet/ConnectWallet'
import AdminActions from './components/AdminView/AdminActions'

function App() {
  const { wallet } = useWallet()
  return (
    <>
      <ConnectWallet />

      {wallet?.accounts[0].address === import.meta.env.VITE_CONTRACT_OWNER.toLowerCase() ? (
        <div>
          <AdminActions />
        </div>
      ) : (
        <div>
          <h1>Wallet is not owner of contract</h1>
        </div>
      )}
    </>
  )
}

export default App
