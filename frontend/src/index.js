import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from "./utils/AuthContext";
import {CssVarsProvider} from "@mui/joy/styles";
import {CssBaseline} from "@mui/joy";

const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
          <AuthProvider>
              <CssVarsProvider>
                  <CssBaseline/>
                    <App />
              </CssVarsProvider>
          </AuthProvider>
      </React.StrictMode>
);

