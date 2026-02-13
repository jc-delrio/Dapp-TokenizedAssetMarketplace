import './App.css'
import { useWallet } from './hooks/useWallet'
import ConnectWallet from './components/Wallet/ConnectWallet'
import AdminView from './components/features/admin/AdminView'
import UserView from './components/features/user/UserView'
import { Toaster } from "@/components/ui/sonner"

function App() {
  const { wallet, isWeb3Loading } = useWallet()
  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold underline text-center m-5'>Tokenized Asset Marketplace</h1>
      <Toaster className="toaster" />
      <ConnectWallet />

      {wallet && !isWeb3Loading
        ? wallet?.accounts[0].address === import.meta.env.VITE_ADMIN_ADDRESS.toLowerCase()
          ? <AdminView />
          : <UserView />
        : <h3 className='text-center m-20'>Conecta tu wallet para continuar</h3>
      }
    </div>
  )
}

export default App
