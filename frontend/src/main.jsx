import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './css/index.css'
import App from './pages/Dinocats/App'


createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/app'>
    <App />
  </BrowserRouter>,
)