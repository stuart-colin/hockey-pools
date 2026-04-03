import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Icon } from 'semantic-ui-react';

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    !isAuthenticated && (
      <Icon
        color='blue'
        name='user circle'
        size='large'
        style={{ cursor: 'pointer' }}
        onClick={() => loginWithRedirect()}
      />
    )
  );
};

export default LoginButton;
