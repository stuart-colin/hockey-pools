import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';

import { Button } from 'semantic-ui-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <Button
        className='ui primary button'
        floated='right'
        onClick={() => logout()}
      >
        Sign Out
        <Profile />
      </Button>
    )
  );
}

export default LogoutButton;