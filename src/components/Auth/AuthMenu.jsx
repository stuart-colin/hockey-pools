import React from 'react';
import {
  Dropdown,
  Icon,
  Image,
} from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthMenu = () => {
  const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();

  if (!isAuthenticated) {
    return (
      <Icon
        color='blue'
        name='user circle'
        size='large'
        style={{ cursor: 'pointer' }}
        onClick={() => loginWithPopup()}
      />
    );
  }

  const trigger = user?.picture ? (
    <Image
      alt={user.name}
      avatar
      src={user.picture}
      style={{ cursor: 'pointer' }}
    />
  ) : (
    <Icon
      color='blue'
      name='user circle'
      size='large'
      style={{ cursor: 'pointer' }}
    />
  );

  return (
    <Dropdown
      icon={null}
      pointing='top right'
      trigger={trigger}
    >
      <Dropdown.Menu>
        <Dropdown.Header>
          <div style={{ padding: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {user?.name}
            </div>
            {user?.email !== user?.name && (
              <div style={{ color: '#666', fontSize: '0.9em' }}>
                {user?.email}
              </div>
            )}
          </div>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() => logout()}
          text='Sign Out'
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AuthMenu;
