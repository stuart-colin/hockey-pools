import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Auth0Provider } from "@auth0/auth0-react";
import "semantic-ui-css/semantic.min.css";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const baseUrl = process.env.REACT_APP_BASE_URL;
console.log("BASE_URL", baseUrl);

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: `https://${domain}/api/v2/`,
      scope: "read:current_user update:current_user_metadata roster:create",
    }}
  >
    <App />
  </Auth0Provider>,
  document.querySelector("#root")
);
