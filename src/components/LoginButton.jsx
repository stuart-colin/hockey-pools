import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Icon } from 'semantic-ui-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    !isAuthenticated && (
      <Icon name='user circle'
        size='large'
        color='blue'
        style={{ cursor: 'pointer' }}
        onClick={() => loginWithRedirect()} />
    )
  );
}

export default LoginButton;