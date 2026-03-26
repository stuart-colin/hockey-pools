import React from 'react';
import { Button, Icon, Image, Table } from 'semantic-ui-react';
import {
  TEAM_LOGO_URL,
  PLAYER_HEADSHOT_URL,
} from '../../constants/teambuilder';
import { getTeamAbbrev, getPlayerName, getPlayerStatsDisplay } from '../../utils/teambuilder';

const PlayerRow = ({ player, isSelected, isDisabled, onToggle }) => {
  const teamAbbrev = getTeamAbbrev(player.teamAbbrevs);
  const playerName = getPlayerName(player);
  const statsDisplay = getPlayerStatsDisplay(player);

  return (
    <Table.Row key={player.playerId}>
      <Table.Cell>
        <Button
          icon
          disabled={isDisabled}
          color={isSelected ? 'blue' : null}
          onClick={() => onToggle(player)}
        >
          <Icon name='check' />
        </Button>
      </Table.Cell>
      <Table.Cell>{player.positionCode}</Table.Cell>
      <Table.Cell>
        <Image
          avatar
          size='mini'
          src={`${PLAYER_HEADSHOT_URL}${teamAbbrev}/${player.playerId}.png`}
          alt={`${playerName} Headshot`}
        />
        {playerName}
      </Table.Cell>
      <Table.Cell>
        <Image
          avatar
          size='mini'
          src={`${TEAM_LOGO_URL}${teamAbbrev}_light.svg`}
          alt={`${teamAbbrev} Logo`}
        />
        {teamAbbrev}
      </Table.Cell>
      <Table.Cell>{statsDisplay}</Table.Cell>
    </Table.Row>
  );
};

export default PlayerRow;
