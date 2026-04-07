import React from 'react';
import {
  Grid,
  Header
} from 'semantic-ui-react';
import StatsSlim from '../StatsSlim';
import rosterPositions from '../../constants/rosterPositions';

const playerSlotSpacingStyle = {
  paddingBottom: '10px',
};

const RosterGrid = ({ roster }) => {
  const rosterPlayers = rosterPositions.map((position, index) => {
    const playersInPosition =
      position === 'utility'
        ? roster.utility
          ? [roster.utility]
          : []
        : Array.isArray(roster[position])
          ? roster[position]
          : [];

    return (
      <Grid.Column key={index}>
        <Header size='small' color='blue'>
          {position.charAt(0).toUpperCase() + position.slice(1)}
        </Header>
        {playersInPosition.map((player, playerIndex) => (
          <div style={playerSlotSpacingStyle} key={playerIndex}>
            <StatsSlim player={player} />
          </div>
        ))}
      </Grid.Column>
    );
  });

  return rosterPlayers;
};

export default RosterGrid;
