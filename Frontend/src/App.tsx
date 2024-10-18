import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { MainRouter } from "./Routes/Router";
import { Provider } from "react-redux";
import store, { persistor } from "./Redux/Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SocketProvider from "./Context/SocketContext";


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <GoogleOAuthProvider clientId={clientId}>
            <BrowserRouter>
           <SocketProvider>
              <MainRouter />                
              </SocketProvider>
            </BrowserRouter>
            <Toaster />
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
