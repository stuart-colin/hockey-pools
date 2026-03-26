import React from 'react';
import { Button, Icon, Image, Table } from 'semantic-ui-react';
import {
  TEAM_LOGO_URL,
  PLAYER_HEADSHOT_URL,
} from '../../constants/teambuilder';
import { getTeamAbbrev, getPlayerName, getStatValue, getStatLabel } from '../../utils/teambuilder';
import StatCell from './TeamBuilder.StatCell';

/**
 * Displays a single roster position slot (filled or empty)
 */
const RosterRow = ({ position, player, onRemove }) => {
  const hasPlayer = !!player;
  const teamAbbrev = hasPlayer ? getTeamAbbrev(player.teamAbbrevs) : null;
  const playerName = hasPlayer ? getPlayerName(player) : null;

  return (
    <Table.Row key={`${position}-${player?.playerId || 'empty'}`}>
      <Table.Cell>
        <Button
          icon
          color={!hasPlayer ? 'grey' : 'red'}
          onClick={() => onRemove(player)}
          disabled={!hasPlayer}
        >
          <Icon name='trash' />
        </Button>
      </Table.Cell>
      <Table.Cell>{position}</Table.Cell>
      <Table.Cell>
        {hasPlayer && (
          <>
            <Image
              avatar
              size='mini'
              src={`${PLAYER_HEADSHOT_URL}${teamAbbrev}/${player.playerId}.png`}
              alt={`${playerName} Headshot`}
            />
            {playerName}
          </>
        )}
      </Table.Cell>
      <Table.Cell>
        {hasPlayer && (
          <>
            <Image
              avatar
              size='mini'
              src={`${TEAM_LOGO_URL}${teamAbbrev}_light.svg`}
              alt={`${teamAbbrev} Logo`}
            />
            {teamAbbrev}
          </>
        )}
      </Table.Cell>
      <Table.Cell>
        {hasPlayer ? <StatCell label={getStatLabel(player, 0)} value={getStatValue(player, 0)} /> : ''}
      </Table.Cell>
      <Table.Cell>
        {hasPlayer ? <StatCell label={getStatLabel(player, 1)} value={getStatValue(player, 1)} /> : ''}
      </Table.Cell>
      <Table.Cell>
        {hasPlayer ? <StatCell label={getStatLabel(player, 2)} value={getStatValue(player, 2)} /> : ''}
      </Table.Cell>
      <Table.Cell>
        {hasPlayer ? <StatCell label={getStatLabel(player, 3)} value={getStatValue(player, 3)} /> : ''}
      </Table.Cell>
    </Table.Row>
  );
};

export default RosterRow;
