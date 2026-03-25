import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dropdown, Icon, Image } from 'semantic-ui-react';

const AuthMenu = () => {
  const { user, isAuthenticated, loginWithPopup, logout } = useAuth0();

  if (!isAuthenticated) {
    return (
      <Icon
        name='user circle'
        size='large'
        color='blue'
        style={{ cursor: 'pointer' }}
        onClick={() => loginWithPopup()}
      />
    );
  }

  const trigger = user?.picture ? (
    <Image
      avatar
      size='mini'
      src={user.picture}
      alt={user.name}
      style={{ cursor: 'pointer' }}
    />
  ) : (
    <Icon
      name='user circle'
      size='large'
      color='blue'
      style={{ cursor: 'pointer' }}
    />
  );

  return (
    <Dropdown
      trigger={trigger}
      pointing='top right'
      icon={null}
    >
      <Dropdown.Menu>
        <Dropdown.Header>
          <div style={{ padding: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {user?.name}
            </div>
            {user?.email !== user?.name && (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {user?.email}
              </div>
            )}
          </div>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item
          text='Sign Out'
          onClick={() => logout()}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AuthMenu;
