import React from 'react';
import { Button, Icon, Image, Table } from 'semantic-ui-react';
import {
  TEAM_LOGO_URL,
  PLAYER_HEADSHOT_URL,
} from '../../constants/teambuilder';
import { getTeamAbbrev, getPlayerName, getStatValue, getStatLabel } from '../../utils/teambuilder';
import StatCell from './TeamBuilder.StatCell';

const PlayerRow = ({ player, isSelected, isDisabled, onToggle }) => {
  const teamAbbrev = getTeamAbbrev(player.teamAbbrevs);
  const playerName = getPlayerName(player);

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
      <Table.Cell>
        <StatCell label={getStatLabel(player, 0)} value={getStatValue(player, 0)} />
      </Table.Cell>
      <Table.Cell>
        <StatCell label={getStatLabel(player, 1)} value={getStatValue(player, 1)} />
      </Table.Cell>
      <Table.Cell>
        <StatCell label={getStatLabel(player, 2)} value={getStatValue(player, 2)} />
      </Table.Cell>
      <Table.Cell>
        <StatCell label={getStatLabel(player, 3)} value={getStatValue(player, 3)} />
      </Table.Cell>
    </Table.Row>
  );
};

export default PlayerRow;
