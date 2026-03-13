import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { ApiProvider } from './context/ApiContext.jsx';
import { ApiDealerProvider } from './context/DealerApiContext.jsx';
import configStore from './config/store.js';
import { Provider } from 'react-redux';
const store = configStore();

const Root = () => {
  useEffect(() => {
    let deferredPrompt = null

    // Detect if the device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Handle the `beforeinstallprompt` event for PWA installation
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      deferredPrompt = e

      // Show install prompt only on mobile devices
      if (isMobile) {
        // Automatically show the install prompt
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the PWA install prompt')
          } else {
            console.log('User dismissed the PWA install prompt')
          }
          deferredPrompt = null
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  return (
    // <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ApiProvider>
          <ApiDealerProvider>
            <App />
          </ApiDealerProvider>
        </ApiProvider>
      </BrowserRouter>
    </Provider>
    // </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)