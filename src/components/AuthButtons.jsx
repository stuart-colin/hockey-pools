import React, { Fragment } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const AuthButtons = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div>Auth Error</div>; // Simplified error display
  }

  if (isLoading) {
    return <div>Loading...</div>; // Simplified loading display
  }

  return (
    <Fragment>
      {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
    </Fragment>
  );
};

export default AuthButtons;