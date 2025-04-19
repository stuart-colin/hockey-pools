import React, { useEffect, useState, Fragment } from "react";
import { Dropdown, Label, Menu } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import seasons from "../constants/seasons";


const Navigation = ({ onMenuSelect, onSeasonSelect }) => {
  const [activeItem, setActiveItem] = useState('commissioners-corner');
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    onMenuSelect(activeItem);
  }, [activeItem, onMenuSelect]);

  const menuItems = [
    { name: 'commissioners-corner', label: "Commissioner's Corner" },
    { name: 'roster-view', label: 'Roster View' },
    { name: 'insights', label: 'Insights' },
    { name: 'player-details', label: 'Player Details' },
    { name: 'team-details', label: 'Team Details' },
  ];

  return (
    <Menu stackable>
      <Menu.Item header>
        <img
          alt="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Ice_hockey_puck.svg"
        />
      </Menu.Item>

      {menuItems.map((item) => (
        <Menu.Item
          key={item.name}
          name={item.name}
          active={activeItem === item.name}
          onClick={() => setActiveItem(item.name)}
        >
          {item.label}
        </Menu.Item>
      ))}

      <Menu.Menu position="right">
        {/* {isAuthenticated && (
          <Menu.Item
            name="team-builder"
            active={activeItem === 'team-builder'}
            onClick={() => setActiveItem('team-builder')}
          >
            Team Builder
            <Label color="red">Beta</Label>
          </Menu.Item>
        )} */}
        {/* Dropdown for future season selection */}
        {/* <Dropdown item text="Season Select">
          <Dropdown.Menu>
            {renderedSeasons}
            <Dropdown.Item key="coming-soon" text="More to come!" />
          </Dropdown.Menu>
        </Dropdown> */}
      </Menu.Menu>
    </Menu>
  );
};

export default Navigation;