import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AuthMenu from './AuthMenu';

const AuthButtons = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Auth Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthMenu />;
};

export default AuthButtons;