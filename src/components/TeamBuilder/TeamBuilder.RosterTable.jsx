import React, { useMemo } from 'react';
import { Button, Grid, Header, Image, Table } from 'semantic-ui-react';
import RosterRow from './TeamBuilder.RosterRow';
import SubmissionFeedback from './TeamBuilder.SubmissionFeedback';
import { ROSTER_POSITIONS, TEAM_LOGO_URL, POSITION_COUNTS, TOTAL_ROSTER_SIZE } from '../../constants/teambuilder';
import { findUtilityPlayer } from '../../utils/teambuilder';
/**
 * Right panel: Team roster display and submission
 */
const RosterTable = ({
  myTeam,
  teamCount,
  submissionStatus,
  teamIds,
  onClearTeam,
  onRemovePlayer,
  onSubmit,
}) => {
  // Build roster rows by position
  const rosterRows = useMemo(() => {
    const remainingPlayers = [...myTeam];
    const utilityPlayer = findUtilityPlayer(myTeam);

    return ROSTER_POSITIONS.map((position, index) => {
      if (position === 'U') {
        return (
          <RosterRow
            key={`utility-${utilityPlayer?.playerId || 'empty'}`}
            position='U'
            player={utilityPlayer}
            onRemove={() => onRemovePlayer(utilityPlayer)}
          />
        );
      }

      // Regular positions - exclude utility player from position slots
      const playerIndex = remainingPlayers.findIndex(
        (p) => p.playerId !== utilityPlayer?.playerId && p.positionCode === position
      );
      const player = playerIndex !== -1
        ? remainingPlayers.splice(playerIndex, 1)[0]
        : null;

      return (
        <RosterRow
          key={`${position}-${index}`}
          position={position}
          player={player}
          onRemove={() => onRemovePlayer(player)}
        />
      );
    });
  }, [myTeam, onRemovePlayer]);

  return (
    <Grid.Column style={{ maxHeight: '60vh', overflow: 'auto' }}>
      <Grid stackable style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', marginBottom: '10px' }}>
        <Header as='h4'>My Team</Header>
        <Button.Group size='small' floated='right'>
          <Button color='red' disabled={myTeam.length === 0} onClick={onClearTeam}>
            Clear
          </Button>
          <Button
            color='green'
            disabled={myTeam.length < TOTAL_ROSTER_SIZE}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Button.Group>

        <Grid.Row>
          <Grid.Column>
            <SubmissionFeedback status={submissionStatus} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {/* Team stats */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button size='tiny' color='blue'>
                {myTeam.length} / {TOTAL_ROSTER_SIZE} Players
              </Button>
              {Object.entries(teamCount).map(([team, count]) => (
                <Button key={team} size='tiny'>
                  <Image
                    avatar
                    src={`${TEAM_LOGO_URL}${team}_light.svg`}
                    alt={`${team} Logo`}
                  />
                  {count}
                </Button>
              ))}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* Roster table */}
      <Table singleLine unstackable basic='very' compact='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Remove</Table.HeaderCell>
            <Table.HeaderCell>Position</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>Stats</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rosterRows}</Table.Body>
      </Table>
    </Grid.Column>
  );
};

export default RosterTable;
