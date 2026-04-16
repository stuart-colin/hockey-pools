import React, { useMemo } from 'react';
import {
  Flag,
  Grid,
  Header,
  Segment,
  Statistic
} from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import RosterGrid from './MyTeam.RosterGrid';
import SignInNotice from '../SignInNotice';
import eliminatedPlayers from '../../utils/eliminatedPlayers';
import normalizePlayer from '../../utils/normalizePlayer';
import { augmentRoster } from '../../utils/parseLiveStats';
import { useEliminatedTeamsContext } from '../../context/EliminatedTeamsContext';
import countPoints from '../../utils/countPoints';
import useMyTeam from '../../hooks/useMyTeam';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { POSITION_ARRAYS } from '../../constants/positions';
import { getPlayersRemainingColor } from '../../constants/playersRemaining';

const noTeamHeaderStyle = {
  whiteSpace: 'nowrap',
};

const ownerHeaderStyle = {
  marginBottom: '8px',
};

const ownerMetaStyle = {
  fontSize: '0.95em',
  color: '#666',
};

const statsColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'flex-end',
};

const ParticipantRoster = ({ playerDeltas, rosterDataEndpoint }) => {
  const { eliminatedTeams } = useEliminatedTeamsContext();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const { roster: rawRoster, error, isLoading } = useMyTeam(rosterDataEndpoint);

  const { isMobile, isTablet } = useBreakpoint();

  const roster = useMemo(() => {
    if (!rawRoster) return null;
    const normalized = { ...rawRoster };
    for (const pos of POSITION_ARRAYS) {
      normalized[pos] = Array.isArray(rawRoster[pos])
        ? rawRoster[pos].map(p => normalizePlayer(p, eliminatedTeams)).filter(Boolean)
        : [];
    }
    normalized.utility = rawRoster.utility
      ? normalizePlayer(rawRoster.utility, eliminatedTeams)
      : null;
    // Augment with live stats if available
    return playerDeltas?.size > 0 ? augmentRoster(normalized, playerDeltas) : normalized;
  }, [rawRoster, eliminatedTeams, playerDeltas]);

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <SignInNotice
        message='Use the sign-in button to create an account or log in, then come back to view your team.'
        title='Sign in to see your team'
      />
    );
  }

  if (isLoading) {
    return <Segment loading>Loading roster...</Segment>;
  }

  if (error) {
    return <Segment>Error: {error}</Segment>;
  }

  if (!roster) {
    return (
      <Segment.Group>
        <Segment attached='top'>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column width={2} />
              <Grid.Column width={12} textAlign='center'>
                <Header size='medium' color='blue' style={noTeamHeaderStyle}>
                  No Team Found
                </Header>
                Head to the Team Builder to pick your roster.
              </Grid.Column>
              <Grid.Column width={2} />
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
  }

  const playersRemainingCount = eliminatedPlayers(roster, eliminatedTeams);

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <Header size='medium' color='blue' style={ownerHeaderStyle}>
                {roster.owner.name}
              </Header>
              <div style={ownerMetaStyle}>
                {roster.owner && roster.owner.country && roster.owner.country.toLowerCase() !== 'n/a' && (
                  <>
                    <Flag name={roster.owner.country.toLowerCase()} />
                    {' '}
                  </>
                )}
                {roster.owner.region}
              </div>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <div style={statsColumnStyle}>
                <Statistic horizontal color='blue' size='mini'>
                  <Statistic.Value>{countPoints(roster)}</Statistic.Value>
                  <Statistic.Label>Points</Statistic.Label>
                </Statistic>
                <Statistic horizontal color='blue' size='mini'>
                  <Statistic.Value
                    style={{ color: getPlayersRemainingColor(playersRemainingCount) }}
                  >
                    {playersRemainingCount}/16
                  </Statistic.Value>
                  <Statistic.Label>Players</Statistic.Label>
                </Statistic>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment attached='bottom' className={'expandedRosterStyle'}>
        <Grid stackable columns={isMobile ? 1 : isTablet ? 2 : 3}>
          <RosterGrid roster={roster} />
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default ParticipantRoster;
