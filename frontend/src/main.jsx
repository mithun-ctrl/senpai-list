import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/authContext'
import { Toaster } from 'react-hot-toast';
import { XCircle, CheckCircle2 } from 'lucide-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" 

          toastOptions={{
            success: {
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(74, 222, 128, 0.5)',
                padding: '12px 24px',
                boxShadow: '0 4px 12px rgba(74, 222, 128, 0.2)',
                fontSize: '0.875rem',
                maxWidth: '350px',
              },
              icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
              className: 'animate-slideIn',
            },
            error: {
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                padding: '12px 24px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                fontSize: '0.875rem',
                maxWidth: '350px',
              },
              icon: <XCircle className="w-5 h-5 text-red-400" />,
              className: 'animate-slideIn',
            },

            loading: {
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                padding: '12px 24px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                fontSize: '0.875rem',
                maxWidth: '350px',
              },
            }
          }}

        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)