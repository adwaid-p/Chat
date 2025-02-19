import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import UserContext from './context/UserContext.jsx';
import MessageContext from './context/MessageContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
      <MessageContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MessageContext>
    </UserContext>
  </StrictMode>,
)
