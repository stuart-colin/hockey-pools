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

const AVATAR_COLORS = [
  '#db2828', // red
  '#f2711c', // orange
  '#b5cc18', // olive
  '#21ba45', // green
  '#00b5ad', // teal
  '#2185d0', // blue
  '#6435c9', // violet
  '#a333c8', // purple
  '#e03997', // pink
  '#a5673f', // brown
];

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getAvatarSvg = (name) => {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="32" fill="${color}"/><text x="32" y="32" text-anchor="middle" dy=".36em" fill="white" font-family="sans-serif" font-size="24" font-weight="500">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
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
        <Image avatar src={getAvatarSvg(user.owner.name)} alt='participant avatar' verticalAlign='middle' style={{ width: '2.5em', height: '2.5em' }} />
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