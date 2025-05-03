import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Sidebar, Icon, Label, Segment } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMediaQuery } from 'react-responsive';
import AuthButtons from './AuthButtons';

const Navigation = ({ onMenuSelect }) => {
  const [activeItem, setActiveItem] = useState();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isAuthenticated } = useAuth0();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    isMobile ? setActiveItem('standings') : setActiveItem('insights')
  }, [isMobile, setActiveItem]);

  useEffect(() => {
    onMenuSelect(activeItem);
  }, [activeItem, onMenuSelect]);

  const menuItems = [
    { name: "standings", label: "Standings", mobileOnly: true },
    { name: "commissioners-corner", label: "Commissioner's Corner" },
    { name: "my-team", label: "My Team" },
    { name: "insights", label: "Insights" },
    { name: "player-details", label: "Player Details" },
    { name: "team-details", label: "Team Details" },
  ];

  const renderMenuItems = (isMobileLayout = false) =>
    menuItems
      .filter(item => isMobileLayout ? true : !item.mobileOnly)
      .map((item) => (
        <Menu.Item
          key={item.name}
          name={item.name}
          active={activeItem === item.name}
          onClick={() => {
            setActiveItem(item.name);
            setSidebarVisible(false);
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
              <AuthButtons />
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
            {renderMenuItems(true)}
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
          <Segment basic style={{ marginTop: '50px' }} />
        </>
      ) : (
        // Desktop Layout
        <Menu stackable>
          {renderMenuItems(false)}
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
              <AuthButtons />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      )}
    </>
  );
};

export default Navigation;