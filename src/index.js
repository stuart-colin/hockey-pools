import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { Auth0Provider } from "@auth0/auth0-react";
import "semantic-ui-css/semantic.min.css";
import "./css/appShell.css";
import "./css/customStyle.css";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const baseUrl = process.env.REACT_APP_BASE_URL;

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <BrowserRouter>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: `${baseUrl}/`,
        scope: "openid profile email read:current_user update:current_user_metadata roster:create",
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
