import React, { useEffect, useState, useMemo } from 'react';
import {
  Checkbox,
  Icon,
  Image,
  Label,
  Menu,
} from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { APP_CONFIG } from '../../config/appConfig';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import useIsAdmin from '../../hooks/useIsAdmin';
import usePlayoffLock from '../../hooks/usePlayoffLock';
import { AuthButtons } from '../Auth';
import NavigationSidebar from './Navigation.Sidebar';

const mobileHeaderTitleStyle = {
  flex: 1,
  justifyContent: 'center',
  color: '#2185d0',
  fontSize: '1.3em',
};

const Navigation = ({ liveStatsEnabled, onLiveStatsToggle }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useIsAdmin();
  const { hasStarted } = usePlayoffLock();

  const { isMobile, isTablet, isWide } = useBreakpoint();
  const isMobileOrTablet = isMobile || isTablet;

  const menuItems = useMemo(() => [
    { name: "commissioners-corner", label: "Commissioner's Corner", path: "/commissioners-corner" },
    { name: "standings", label: "Standings", hideOnWide: true, path: "/standings" },
    { name: "insights", label: "Insights", path: "/insights" },
    { name: "history", label: "History", path: "/history" },
    { name: "player-details", label: "Player Details", path: "/player-details" },
    { name: "team-details", label: "Team Details", path: "/team-details" },
    { name: "my-team", label: "My Team", path: "/my-team" },
    { name: "team-builder", label: "Team Builder", path: "/team-builder", hideAfterPlayoffs: true },
    ...(isAdmin ? [{ name: "admin", label: "🔧 Admin", path: "/admin" }] : []),
  ], [isAdmin]);

  // Get current active item from URL pathname
  const activeItem = useMemo(() => {
    const fallbackPath = hasStarted
      ? (isWide ? '/insights' : '/standings')
      : '/team-builder';
    const pathname = location.pathname === '/' ? fallbackPath : location.pathname;
    const item = menuItems.find(m => m.path === pathname);
    return item?.name || (hasStarted ? (isWide ? 'insights' : 'standings') : 'team-builder');
  }, [location.pathname, menuItems, isWide, hasStarted]);

  // Set default landing page on mount if on root
  useEffect(() => {
    if (location.pathname === '/') {
      const target = hasStarted
        ? (isWide ? '/insights' : '/standings')
        : '/team-builder';
      navigate(target, { replace: true });
    }
  }, [location.pathname, isWide, navigate, hasStarted]);

  const renderMenuItems = () =>
    menuItems
      .filter(item => !item.hideOnWide || !isWide)
      .filter(item => !item.hideAfterPlayoffs || !hasStarted || isAdmin)
      .map((item) => (
        <Menu.Item
          key={item.name}
          name={item.name}
          active={activeItem === item.name}
          onClick={() => {
            navigate(item.path);
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
          <Menu fixed='bottom' fluid>
            <Menu.Item onClick={() => setSidebarVisible(!sidebarVisible)}>
              <Icon
                color='blue'
                name={sidebarVisible ? 'close' : 'bars'}
                size='large'
              />
            </Menu.Item>
            <Menu.Item header style={mobileHeaderTitleStyle}>
              {menuItems.find(item => item.name === activeItem)?.label}
            </Menu.Item>
            <Menu.Item position='right'>
              <AuthButtons />
            </Menu.Item>
          </Menu>

          <NavigationSidebar
            isVisible={sidebarVisible}
            onClose={() => setSidebarVisible(false)}
          >
            <Menu vertical fluid>
              <Menu.Item header>
                <Image
                  alt='bps annual hockey pool logo'
                  centered
                  size='small'
                  src={APP_CONFIG.logoPath}
                />
              </Menu.Item>
              {renderMenuItems()}
              <Menu.Item>
                {liveStatsBadge}
              </Menu.Item>
            </Menu>
          </NavigationSidebar>
        </>
      ) : (
        <Menu stackable>
          <Menu.Item>
            <Image
              alt='bps annual hockey pool logo'
              size='mini'
              src={APP_CONFIG.logoPath}
              style={{ scale: '1.3' }}
            />
          </Menu.Item>
          {renderMenuItems()}
          <Menu.Menu position='right'>
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