import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserContextProvider } from './Usercontext.jsx'


createRoot(document.getElementById('root')).render(
  
  <StrictMode>
   <UserContextProvider>
   <App />
  
    </UserContextProvider>
 
   
  </StrictMode>,
)
