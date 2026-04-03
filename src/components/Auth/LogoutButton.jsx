import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'semantic-ui-react';

const LogoutButton = () => {
  const { isAuthenticated, logout } = useAuth0();
  return (
    isAuthenticated && (
      <Button
        className='ui primary button'
        floated='right'
        onClick={() => logout()}
      >
        Sign Out
      </Button>
    )
  );
};

export default LogoutButton;
