import React from 'react';
import {
  Dropdown,
  Icon,
  Image,
} from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';

const clickableIconStyle = {
  cursor: 'pointer',
};

const dropdownHeaderPaddingStyle = {
  padding: '8px',
};

const dropdownHeaderNameStyle = {
  fontWeight: 'bold',
  marginBottom: '4px',
};

const dropdownHeaderEmailStyle = {
  color: '#666',
  fontSize: '0.9em',
};

const AuthMenu = () => {
  const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();

  if (!isAuthenticated) {
    return (
      <Icon
        color='blue'
        name='user circle'
        size='large'
        style={clickableIconStyle}
        onClick={() => loginWithPopup()}
      />
    );
  }

  const trigger = user?.picture ? (
    <Image
      alt={user.name}
      avatar
      src={user.picture}
      style={clickableIconStyle}
    />
  ) : (
    <Icon
      color='blue'
      name='user circle'
      size='large'
      style={clickableIconStyle}
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
          <div style={dropdownHeaderPaddingStyle}>
            <div style={dropdownHeaderNameStyle}>
              {user?.name}
            </div>
            {user?.email !== user?.name && (
              <div style={dropdownHeaderEmailStyle}>
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
