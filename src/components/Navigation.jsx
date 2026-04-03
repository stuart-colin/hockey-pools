import React, { useEffect, useState } from 'react';
import { Checkbox, Menu, Sidebar, Icon, Segment, Label } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import AuthButtons from './AuthButtons';

const Navigation = ({ liveStatsEnabled, onLiveStatsToggle, onMenuSelect }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeItem, setActiveItem] = useState('insights');
  const { isAuthenticated, user } = useAuth0();
  const isAdmin = user?.email === 'stuart.colin@gmail.com';

  const { isMobile, isTablet, isDesktop, isWide } = useBreakpoint();
  const isMobileOrTablet = isMobile || isTablet;

  useEffect(() => {
    setActiveItem(isMobileOrTablet ? 'standings' : 'insights');
  }, [isMobileOrTablet]);

  useEffect(() => {
    onMenuSelect(activeItem);
  }, [activeItem, onMenuSelect]);

  const menuItems = [
    { name: "commissioners-corner", label: "Commissioner's Corner" },
    { name: "standings", label: "Standings", hideOnWide: true },
    { name: "insights", label: "Insights" },
    { name: "player-details", label: "Player Details" },
    { name: "team-details", label: "Team Details" },
    { name: "my-team", label: "My Team" },
    ...(isAdmin ? [{ name: "admin", label: "🔧 Admin" }] : []),
  ];

  const renderMenuItems = () =>
    menuItems
      .filter(item => !item.hideOnWide || !isWide)
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

  const liveStatsBadge = (
    <>
      <Checkbox
        checked={liveStatsEnabled}
        label='Live Stats'
        onChange={onLiveStatsToggle}
        toggle
      />
      <Label color='red' size='mini'>
        Beta
      </Label>
    </>
  );

  return (
    <>
      {isMobileOrTablet ? (
        <>
          <Menu fixed='bottom'>
            <Menu.Item onClick={() => setSidebarVisible(!sidebarVisible)}>
              <Icon
                color='blue'
                name={sidebarVisible ? 'close' : 'bars'}
                size='large'
              />
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
              </Menu.Item>
            )}
            <Menu.Item>
              {liveStatsBadge}
            </Menu.Item>
          </Sidebar>
          <Segment basic style={{ marginTop: '50px' }} />
        </>
      ) : (
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
              </Menu.Item>
            )}
            <Menu.Item>
              {liveStatsBadge}
            </Menu.Item>
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