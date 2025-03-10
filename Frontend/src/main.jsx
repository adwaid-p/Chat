import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import UserContext from './context/UserContext.jsx';
import MessageContext from './context/MessageContext.jsx';
import IncoMessageContext from './context/IncoMessageContext.jsx';
import CallContext from './context/CallContext.jsx';
import { SocketProvider } from './context/SocketContext';
import GroupContext from './context/GroupContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <UserContext>
        <MessageContext>
          <GroupContext>
            <IncoMessageContext>
              <CallContext>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CallContext>
            </IncoMessageContext>
          </GroupContext>
        </MessageContext>
      </UserContext>
    </SocketProvider>
  </StrictMode>,
)
