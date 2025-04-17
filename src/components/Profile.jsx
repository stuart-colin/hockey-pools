import React, { useEffect, Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Image } from "semantic-ui-react";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;

  useEffect(() => {
    const getUserMetadata = async () => {
      console.log("Trying to get user Access Token");

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user ",
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        // setUserMetadata(user_metadata);
        console.log(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };
    console.log("User:", user);

    getUserMetadata();
  }, [getAccessTokenSilently, user && user.sub]);

  return (
    isAuthenticated && (
      <Fragment>
        {user.picture && (
          <Image
            avatar
            size="mini"
            floated="right"
            src={user.picture}
            alt={user.name}
          />
        )}
        {/* {user.name && <span>{user.name}</span>} */}
        {JSON.stringify(user)}
      </Fragment>
    )
  );
};

export default Profile;
