import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Icon } from 'semantic-ui-react';

const clickableIconStyle = {
  cursor: 'pointer',
};

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    !isAuthenticated && (
      <Icon
        color='blue'
        name='user circle'
        size='large'
        style={clickableIconStyle}
        onClick={() => loginWithRedirect()}
      />
    )
  );
};

export default LoginButton;
