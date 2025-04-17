import React, { useEffect, Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Image } from "semantic-ui-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;

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
