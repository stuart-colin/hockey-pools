import React, { useMemo, useState } from 'react';
import { Button, Grid, Header, Image, Table, Icon, Label } from 'semantic-ui-react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import RosterRow from './TeamBuilder.RosterRow';
import SubmissionFeedback from './TeamBuilder.SubmissionFeedback';
import ConfirmationDialog from './TeamBuilder.ConfirmationDialog';
import { ROSTER_POSITIONS, TEAM_LOGO_URL, TOTAL_ROSTER_SIZE } from '../../constants/teambuilder';
import { findUtilityPlayer, createTableHeader } from '../../utils/teambuilder';

const mobileDrawerStyle = (isExpanded) => ({
  position: 'fixed',
  top: isExpanded ? 'var(--app-scoreboard-height, 55px)' : 'auto',
  bottom: 'var(--app-mobile-bottom-offset, 55px)',
  left: 0,
  right: 0,
  zIndex: 20,
  background: 'white',
  borderTop: '2px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'column',
});

const mobileCollapsedHeaderRowStyle = {
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  gap: '8px',
};

const myTeamTitleStrongStyle = {
  whiteSpace: 'nowrap',
  fontSize: '16px',
};

const labelInlineFlexStyle = {
  display: 'inline-flex',
  alignItems: 'center',
};

const mobileTeamLogoStyle = {
  width: '16px',
  height: '16px',
  marginRight: '4px',
  transform: 'scale(1.5)',
};

const chevronAutoMarginStyle = {
  marginLeft: 'auto',
};

const positionPreviewRowStyle = {
  display: 'flex',
  gap: '0',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: '0 16px 8px 16px',
  borderBottom: '1px solid #e0e0e0',
};

const positionSlotStyle = (filled) => ({
  padding: '0',
  borderRadius: '4px',
  fontSize: '10px',
  fontWeight: 'bold',
  background: filled ? '#3688ce' : '#d0d0d0',
  color: filled ? 'white' : '#666',
  width: '22px',
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  flexShrink: 0,
});

const mobileExpandedHeaderStyle = {
  padding: '8px 16px',
  borderBottom: '1px solid #e0e0e0',
};

const mobileRosterScrollStyle = {
  flex: '1 1 0',
  minHeight: 0,
  overflow: 'auto',
  padding: '12px 16px',
  WebkitOverflowScrolling: 'touch',
};

/* Single root — parent Grid.Column is in TeamBuilder (avoid nested .column / broken flex height) */
const desktopRosterRootStyle = {
  padding: 0,
  flex: '1 1 0',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const desktopStickyHeaderGridStyle = {
  padding: 0,
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: 'white',
  marginBottom: '10px',
  flex: 'none',
};

const rosterHeaderNoMarginStyle = {
  margin: 0,
};

const desktopTeamSummaryRowStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignItems: 'center',
};

const desktopTeamLogoStyle = {
  width: '17.5px',
  height: '17.5px',
  marginRight: '8px',
  scale: '2',
};

const submissionFeedbackGridStyle = {
  padding: 0,
  marginTop: -20,
  marginBottom: 0,
  flex: 'none',
};

const rosterTableScrollStyle = {
  flex: '1 1 0',
  minHeight: 0,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
};

/**
 * Right panel: Team roster display and submission
 */
const RosterTable = ({
  canSubmit = true,
  myTeam,
  onClearTeam,
  onDismissStatus,
  onRemovePlayer,
  onSubmit,
  submissionStatus,
  teamCount,
}) => {
  const { isMobile } = useBreakpoint();
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null); // 'clear' | 'submit' | null

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
      <>
        <div style={mobileDrawerStyle(isExpanded)}>
          {/* Collapsed header */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            style={mobileCollapsedHeaderRowStyle}
          >
            <strong style={myTeamTitleStrongStyle}>My Team</strong>

            {/* Team stats - compact */}
            <Label size='small' style={labelInlineFlexStyle}>
              {myTeam.length}/{TOTAL_ROSTER_SIZE}
              {Object.entries(teamCount).map(([team, count]) => (
                <Label.Detail key={team} style={labelInlineFlexStyle}>
                  <Image
                    src={`${TEAM_LOGO_URL}${team}_light.svg`}
                    alt={`${team} Logo`}
                    style={mobileTeamLogoStyle}
                  />
                  {count}
                </Label.Detail>
              ))}
            </Label>

            <Icon circular color='blue' name={isExpanded ? 'chevron down' : 'chevron up'} style={chevronAutoMarginStyle} />
          </div>

          {/* Position preview row */}
          <div style={positionPreviewRowStyle}>
            {positionPreview.map((slot) => (
              <div
                key={slot.key}
                style={positionSlotStyle(slot.filled)}
              >
                {slot.position}
              </div>
            ))}
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <>
              <div style={mobileExpandedHeaderStyle}>
                {/* Action buttons */}
                <Button.Group size='small' fluid>
                  <Button color='red' disabled={myTeam.length === 0} onClick={() => setConfirmationAction('clear')}>
                    Clear
                  </Button>
                  <Button
                    color='green'
                    disabled={myTeam.length < TOTAL_ROSTER_SIZE || !canSubmit}
                    onClick={() => setConfirmationAction('submit')}
                  >
                    Submit
                  </Button>
                </Button.Group>

                {/* Submission feedback */}
                {submissionStatus && ['processing', 'success', 'error'].includes(submissionStatus) && (
                  <SubmissionFeedback status={submissionStatus} onDismiss={onDismissStatus} />
                )}
              </div>

              <div
                style={mobileRosterScrollStyle}
              >
                {/* Roster table */}
                <Table singleLine unstackable basic='very' compact='very'>
                  {createTableHeader()}
                  <Table.Body>{rosterRows}</Table.Body>
                </Table>
              </div>
            </>
          )}
        </div>

        {/* Clear Team Confirmation Modal */}
        <ConfirmationDialog
          isOpen={confirmationAction === 'clear'}
          actionType='clear'
          onConfirm={() => {
            setConfirmationAction(null);
            onClearTeam();
          }}
          onCancel={() => setConfirmationAction(null)}
        />

        {/* Submit Team Confirmation Modal */}
        <ConfirmationDialog
          isOpen={confirmationAction === 'submit'}
          actionType='submit'
          onConfirm={() => {
            setConfirmationAction(null);
            onSubmit();
          }}
          onCancel={() => setConfirmationAction(null)}
        />
      </>
    );
  }

  // Desktop view
  return (
    <>
      <div style={desktopRosterRootStyle}>
        <Grid stackable style={desktopStickyHeaderGridStyle}>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={4}>
              <Header
                as='h4'
                style={rosterHeaderNoMarginStyle}
              >
                My Team
              </Header>
            </Grid.Column>
            <Grid.Column width={12}>
              <div style={desktopTeamSummaryRowStyle}>
                <Label size='large' style={labelInlineFlexStyle}>
                  {myTeam.length} / {TOTAL_ROSTER_SIZE}
                  {Object.entries(teamCount).map(([team, count]) => (
                    <Label.Detail key={team} style={labelInlineFlexStyle}>
                      <Image
                        src={`${TEAM_LOGO_URL}${team}_light.svg`}
                        alt={`${team} Logo`}
                        style={desktopTeamLogoStyle}
                      />
                      {count}
                    </Label.Detail>
                  ))}
                </Label>
                <Button.Group size='small'>
                  <Button color='red' disabled={myTeam.length === 0} onClick={() => setConfirmationAction('clear')}>
                    Clear
                  </Button>
                  <Button
                    color='green'
                    disabled={myTeam.length < TOTAL_ROSTER_SIZE || !canSubmit}
                    onClick={() => setConfirmationAction('submit')}
                  >
                    Submit
                  </Button>
                </Button.Group>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {submissionStatus && ['processing', 'success', 'error'].includes(submissionStatus) && (
          <Grid stackable style={submissionFeedbackGridStyle}>
            <Grid.Row>
              <Grid.Column>
                <SubmissionFeedback status={submissionStatus} onDismiss={onDismissStatus} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        {/* Roster table - Scrollable */}
        <div style={rosterTableScrollStyle}>
          <Table singleLine unstackable basic='very' compact='very'>
            {createTableHeader()}
            <Table.Body>{rosterRows}</Table.Body>
          </Table>
        </div>
      </div>

      {/* Clear Team Confirmation Modal */}
      <ConfirmationDialog
        isOpen={confirmationAction === 'clear'}
        actionType='clear'
        onConfirm={() => {
          setConfirmationAction(null);
          onClearTeam();
        }}
        onCancel={() => setConfirmationAction(null)}
      />

      {/* Submit Team Confirmation Modal */}
      <ConfirmationDialog
        isOpen={confirmationAction === 'submit'}
        actionType='submit'
        onConfirm={() => {
          setConfirmationAction(null);
          onSubmit();
        }}
        onCancel={() => setConfirmationAction(null)}
      />
    </>
  );
};

export default RosterTable;
