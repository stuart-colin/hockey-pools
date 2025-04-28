import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Sidebar, Icon, Label, Segment } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMediaQuery } from 'react-responsive';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const Navigation = ({ onMenuSelect }) => {
  const [activeItem, setActiveItem] = useState();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isLoading, error, user, isAuthenticated } = useAuth0();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    isMobile ? setActiveItem('standings') : setActiveItem('insights')
  }, setActiveItem);

  useEffect(() => {
    onMenuSelect(activeItem);
  }, [activeItem, onMenuSelect]);

  const menuItems = [
    { name: "commissioners-corner", label: "Commissioner's Corner" },
    { name: "roster-view", label: "Roster View" },
    { name: "insights", label: "Insights" },
    { name: "player-details", label: "Player Details" },
    { name: "team-details", label: "Team Details" },
  ];

  const renderMenuItems = () =>
    menuItems.map((item) => (
      <Menu.Item
        key={item.name}
        name={item.name}
        active={activeItem === item.name}
        onClick={() => {
          setActiveItem(item.name);
          setSidebarVisible(false); // Close sidebar on mobile after selection
        }}
      >
        {item.label}
      </Menu.Item>
    ));

  return (
    <>
      {isMobile ? (
        // Mobile Layout with Sidebar
        <>
          <Menu fixed='bottom'>
            <Menu.Item onClick={() => setSidebarVisible(!sidebarVisible)}>
              <Icon
                name={sidebarVisible ? 'close' : 'bars'}
                size='large'
                color='blue' />
            </Menu.Item>
            <Menu.Item position='right'>
              {error && <div>Authentication Error: {error.message}</div>}
              {!error && isLoading && <div>Loading login button...</div>}
              {!error && !isLoading && (
                <Fragment>
                  <LoginButton />
                  <LogoutButton />
                </Fragment>
              )}
            </Menu.Item>
          </Menu>

          <Sidebar
            as={Menu}
            animation='overlay'
            direction='bottom'
            icon='labeled'
            vertical
            visible={sidebarVisible}
            onHide={() => setSidebarVisible(false)}
          >
            <Menu.Item
              key={'standings'}
              name={'standings'}
              active={activeItem === 'standings'}
              onClick={() => {
                setActiveItem('standings');
                setSidebarVisible(false); // Close sidebar on mobile after selection
              }}
            >
              {'Standings'}
            </Menu.Item>
            {renderMenuItems()}
            {isAuthenticated && (
              <Menu.Item
                name='team-builder'
                active={activeItem === 'team-builder'}
                onClick={() => {
                  setActiveItem('team-builder');
                  setSidebarVisible(false);
                }}
              >
                Team Builder
                <Label color='red'>Beta</Label>
              </Menu.Item>
            )}
          </Sidebar>

          {/* Push content down to avoid overlap with the fixed menu */}
          <Segment basic style={{ marginTop: '50px' }} />
        </>
      ) : (
        // Desktop Layout
        <Menu stackable>
          {renderMenuItems()}
          <Menu.Menu position='right'>
            {isAuthenticated && (
              <Menu.Item
                name='team-builder'
                active={activeItem === 'team-builder'}
                onClick={() => setActiveItem('team-builder')}
              >
                Team Builder
                <Label color='red'>Beta</Label>
              </Menu.Item>
            )}
            <Menu.Item>
              {error && <div>Authentication Error: {error.message}</div>}
              {!error && isLoading && <div>Loading login button...</div>}
              {!error && !isLoading && (
                <Fragment>
                  <LoginButton />
                  <LogoutButton />
                </Fragment>
              )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      )}
    </>
  );
};

export default Navigation;