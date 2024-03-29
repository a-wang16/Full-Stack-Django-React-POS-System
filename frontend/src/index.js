import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from "./utils/AuthContext";
import {CssVarsProvider} from "@mui/joy/styles";
import {CssBaseline} from "@mui/joy";
import {OrderProvider} from "./utils/OrderContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
          <AuthProvider>
              <OrderProvider>
                  <CssVarsProvider>
                      <CssBaseline/>
                        <App />
                  </CssVarsProvider>
                </OrderProvider>
          </AuthProvider>
      </React.StrictMode>
);

