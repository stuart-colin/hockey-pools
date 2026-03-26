import React, { useMemo, useState } from 'react';
import { Button, Grid, Header, Image, Table, Icon, Label } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';
import RosterRow from './TeamBuilder.RosterRow';
import SubmissionFeedback from './TeamBuilder.SubmissionFeedback';
import { ROSTER_POSITIONS, TEAM_LOGO_URL, TOTAL_ROSTER_SIZE } from '../../constants/teambuilder';
import { findUtilityPlayer } from '../../utils/teambuilder';

/**
 * Right panel: Team roster display and submission
 */
const RosterTable = ({
  myTeam,
  teamCount,
  submissionStatus,
  onClearTeam,
  onRemovePlayer,
  onSubmit,
  onDismissStatus,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Build position preview (shows which slots are filled) - for mobile drawer
  const positionPreview = useMemo(() => {
    const remainingPlayers = [...myTeam];
    const utilityPlayer = findUtilityPlayer(myTeam);

    return ROSTER_POSITIONS.map((position, index) => {
      if (position === 'U') {
        return {
          position: 'U',
          filled: !!utilityPlayer,
          key: `utility-${utilityPlayer?.playerId || 'empty'}`,
        };
      }

      const playerIndex = remainingPlayers.findIndex(
        (p) => p.playerId !== utilityPlayer?.playerId && p.positionCode === position
      );
      const isFilled = playerIndex !== -1;
      if (isFilled) {
        remainingPlayers.splice(playerIndex, 1);
      }

      return {
        position,
        filled: isFilled,
        key: `${position}-${index}`,
      };
    });
  }, [myTeam]);

  // Mobile drawer view
  if (isMobile) {

    return (
      <div style={{
        position: 'fixed',
        top: isExpanded ? 55 : 'auto',
        bottom: isExpanded ? 55 : 60,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'white',
        borderTop: '2px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Collapsed header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '8px',
          }}
        >
          <strong style={{ whiteSpace: 'nowrap', fontSize: '16px' }}>My Team</strong>

          {/* Team stats - compact */}
          <Label size='small' style={{ display: 'inline-flex', alignItems: 'center' }}>
            {myTeam.length}/{TOTAL_ROSTER_SIZE}
            {Object.entries(teamCount).slice(0, 2).map(([team, count]) => (
              <Label.Detail key={team} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Image
                  src={`${TEAM_LOGO_URL}${team}_light.svg`}
                  alt={`${team} Logo`}
                  style={{ width: '16px', height: '16px', marginRight: '4px', transform: 'scale(1.5)' }}
                />
                {count}
              </Label.Detail>
            ))}
          </Label>

          <Icon circular color='blue' name={isExpanded ? 'chevron down' : 'chevron up'} style={{ marginLeft: 'auto' }} />
        </div>

        {/* Position preview row */}
        <div style={{
          display: 'flex',
          gap: '0',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: '0 16px 8px 16px',
        }}>
          {positionPreview.map((slot) => (
            <div
              key={slot.key}
              style={{
                padding: '0',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                background: slot.filled ? '#4CAF50' : '#d0d0d0',
                color: slot.filled ? 'white' : '#666',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                flexShrink: 0,
              }}
            >
              {slot.position}
            </div>
          ))}
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <>
            <div style={{
              padding: '8px 16px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              {/* Action buttons */}
              <Button.Group size='small' fluid>
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

              {/* Submission feedback */}
              <SubmissionFeedback status={submissionStatus} onDismiss={onDismissStatus} />
            </div>

            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '12px 16px',
              }}
            >
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
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <Grid.Column style={{ padding: 0 }}>
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <Grid stackable style={{ padding: 0, position: 'sticky', top: 0, zIndex: 10, background: 'white', marginBottom: '10px', flex: 'none' }}>
          <Grid.Row>
            <Grid.Column width={4}>
              <Header as='h4' >My Team</Header>
            </Grid.Column>
            <Grid.Column width={12}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Label size='large' style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {myTeam.length} / {TOTAL_ROSTER_SIZE}
                  {Object.entries(teamCount).map(([team, count]) => (
                    <Label.Detail key={team} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Image
                        src={`${TEAM_LOGO_URL}${team}_light.svg`}
                        alt={`${team} Logo`}
                        style={{ width: '17.5px', height: '17.5px', marginRight: '8px', scale: '2' }}
                      />
                      {count}
                    </Label.Detail>
                  ))}
                </Label>
                <Button.Group size='small'>
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
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {submissionStatus && ['processing', 'success', 'error'].includes(submissionStatus) && (
          <Grid stackable style={{ padding: 0, marginTop: -20, marginBottom: 0, flex: 'none' }}>
            <Grid.Row>
              <Grid.Column>
                <SubmissionFeedback status={submissionStatus} onDismiss={onDismissStatus} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        {/* Roster table - Scrollable */}
        <div style={{ flex: 1, overflow: 'auto' }}>
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
        </div>
      </div>
    </Grid.Column>
  );
};

export default RosterTable;
