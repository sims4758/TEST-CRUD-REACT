import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Pet from './Pet.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Pet />
  </StrictMode>,
)
