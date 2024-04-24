import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from "./utils/AuthContext";
import {CssVarsProvider} from "@mui/joy/styles";
import {CssBaseline, extendTheme} from "@mui/joy";
import {OrderProvider} from "./utils/OrderContext";
import {GoogleOAuthProvider} from "@react-oauth/google";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <React.StrictMode>
          <GoogleOAuthProvider clientId="395703218060-lu5j3t587ct43defhjm30o7a9dvvtv2t.apps.googleusercontent.com">
              <AuthProvider>
                  <OrderProvider>
                      <CssVarsProvider
                        defaultMode='dark'
                      >
                      <CssBaseline />
                            <App />
                      </CssVarsProvider>
                    </OrderProvider>
              </AuthProvider>
          </GoogleOAuthProvider>
      </React.StrictMode>
);

