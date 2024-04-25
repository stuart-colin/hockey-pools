import React, { useEffect, useState, Fragment } from "react";
import { Dropdown, Label, Menu } from 'semantic-ui-react';
import seasons from "../constants/seasons";

const Navigation = ({ onMenuSelect, onSeasonSelect, beta }) => {
  const [activeItem, setActiveItem] = useState('insights');

  useEffect(() => {
    onMenuSelect(activeItem);
  }, [activeItem]);

  // const renderedSeasons = seasons.seasonList.map((season, index) => {
  //   return (
  //     <Fragment key={index}>
  //       {season === '2024' || season === '2023' || season === '2022' ?
  //         <Dropdown.Item
  //           onClick={() => onSeasonSelect(season)}
  //           key={index}
  //           text={season}
  //         />
  //         : null}
  //     </Fragment>
  //   );
  // });

  return (
    <Menu stackable>
      <Menu.Item header>
        <img alt='logo' src='https://upload.wikimedia.org/wikipedia/commons/6/6a/Ice_hockey_puck.svg' />
      </Menu.Item>
      <Menu.Item
        name='commissioners-corner'
        active={activeItem === 'commissioners-corner'}
        onClick={() => { setActiveItem('commissioners-corner') }}
      >
        Commissioner's Corner
      </Menu.Item>
      <Menu.Item
        name='roster-view'
        active={activeItem === 'roster-view'}
        onClick={() => { setActiveItem('roster-view') }}
      >
        Roster View
      </Menu.Item>
      <Menu.Item
        name='insights'
        active={activeItem === 'insights'}
        onClick={() => { setActiveItem('insights') }}
      >
        Insights
      </Menu.Item>
      <Menu.Item
        name='player-details'
        active={activeItem === 'player-details'}
        onClick={() => { setActiveItem('player-details') }}
      >
        Player Details
      </Menu.Item>
      <Menu.Item
        name='team-details'
        active={activeItem === 'team-details'}
        onClick={() => { setActiveItem('team-details') }}
      >
        Team Details
      </Menu.Item>
      <Menu.Menu position='right'>
        {beta ?
          <Menu.Item
            name='team-builder'
            active={activeItem === 'team-builder'}
            onClick={() => { setActiveItem('team-builder') }}
          >
            Team Builder
            <Label
              color='red'
              floating
            >
              Beta
            </Label>
          </Menu.Item>
          : null}
        {/* <Dropdown item text='Season Select'>
          <Dropdown.Menu>
            {renderedSeasons}
            <Dropdown.Item
              key={'coming-soon'}
              text={'More to come!'}
            />
          </Dropdown.Menu>
        </Dropdown> */}
      </Menu.Menu>
    </Menu>
  )
}

export default Navigation;