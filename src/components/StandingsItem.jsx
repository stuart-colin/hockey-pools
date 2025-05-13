import React, { Fragment, useState } from 'react';
import {
  Flag,
  Icon,
  Image,
  List,
  Transition,
} from 'semantic-ui-react';
import '../css/customStyle.css';
import RosterView from './RosterView';

const URL = 'https://assets.nhle.com/mugs/nhl/default-skater.png';
// const top6 = ['#66b36650', '#7cbe7c50', '#92c99250', '#a7d3a850', '#bddebe50', '#d3e9d350'];
// const top7 = ['#66b36650', '#79bc7850', '#8bc58a50', '#9dce9c50', '#afd7ae50', '#c1e0c150', '#d3e9d350'];
const top10Colors = ['#66b36650', '#66b36650', '#73b97250', '#7fbf7e50', '#8bc58a50', '#97cb9650', '#afd7af50', '#bbddbb50', '#c7e3c750', '#d3e9d350'];


const StandingsItem = React.forwardRef(({ user, poolSize, isRosterVisible, onToggleRoster }, ref) => {

  // const pot = poolSize * 20;
  // const prizeDistribution = [0.49, 0.15, 0.10, 0.08, 0.07, 0.04, 0.03, 0.02, 0.01, 0.01];
  // const winnings = prizeDistribution.map((percentage) => ` — $${(pot * percentage).toFixed(2)}`);

  const backgroundColor = user.rank <= 10 ? top10Colors[user.rank - 1] : '';

  return (
    <Fragment>
      <div ref={ref} />
      <List.Item style={{ backgroundColor }} onClick={onToggleRoster} >
        <List.Content floated='left' verticalAlign='middle'>
          {user.rank}
        </List.Content>
        <Image avatar src={URL} alt='participant avatar' verticalAlign='middle' />
        {' '}
        <List.Content style={{ paddingLeft: '1em' }}>
          <List.Header>
            {user.owner && user.owner.country && user.owner.country.toLowerCase() !== 'n/a' &&
              <Flag name={user.owner.country.toLowerCase()} />
            }
            {' '}
            {user.owner.name}
            {' '}
          </List.Header>
          <List.Description>
            <span className={`playersRemaining${user.playersRemaining}`}>
              {user.playersRemaining}/16
            </span>
          </List.Description>
        </List.Content>
        <List.Content floated='right' verticalAlign='middle'>
          <span style={{ paddingRight: '1em' }}>
            {user.points} Points
          </span>
          <Icon
            circular
            color='blue'
            name={!isRosterVisible ? 'chevron down' : 'chevron up'}
          />
        </List.Content>
        <Transition visible={isRosterVisible} animation='fade' duration={250} unmountOnHide>
          <div style={{ flexBasis: '100%', width: '100%', paddingTop: '10px' }}>
            <RosterView user={user} />
          </div>
        </Transition>
      </List.Item>
    </Fragment>
  )
});

export default StandingsItem;