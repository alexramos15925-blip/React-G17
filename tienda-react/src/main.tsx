import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CarritoProvider } from './aplicacion/CarritoContext.tsx'
import { SesionProvider } from './aplicacion/SesionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </SesionProvider>
      {/* <App2/> nulo */}
    </BrowserRouter>
  </StrictMode>,
)