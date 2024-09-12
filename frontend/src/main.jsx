import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import ChatContextProvider from './context/ChatProvider.jsx'
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatContextProvider>

  <StoreContextProvider>
  <ChakraProvider>

    <App />
    </ChakraProvider>

  </StoreContextProvider>
  </ChatContextProvider>

  
  </BrowserRouter>
)
