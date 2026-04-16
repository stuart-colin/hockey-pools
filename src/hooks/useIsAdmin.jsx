import { useAuth0 } from '@auth0/auth0-react';

const ADMIN_EMAIL = 'stuart.colin@gmail.com';

const useIsAdmin = () => {
  const { user } = useAuth0();
  return user?.email === ADMIN_EMAIL;
};

export default useIsAdmin;
