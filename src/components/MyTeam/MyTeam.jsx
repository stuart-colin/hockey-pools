import React, { useMemo } from 'react';
import {
  Flag,
  Grid,
  Header,
  Segment,
  Statistic
} from 'semantic-ui-react';
import RosterGrid from './MyTeam.RosterGrid';
import eliminatedPlayers from '../../utils/eliminatedPlayers';
import normalizePlayer from '../../utils/normalizePlayer';
import { augmentRoster } from '../../utils/parseLiveStats';
import { useEliminatedTeamsContext } from '../../context/EliminatedTeamsContext';
import countPoints from '../../utils/countPoints';
import useMyTeam from '../../hooks/useMyTeam';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { POSITION_ARRAYS } from '../../constants/positions';
import '../../css/customStyle.css';

const ParticipantRoster = ({ playerDeltas, rosterDataEndpoint }) => {
  const { eliminatedTeams } = useEliminatedTeamsContext();
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
                <Header size='medium' color='blue' style={{ whiteSpace: 'nowrap' }}>
                  No Team Found
                </Header>
                Please sign in to see your team.
              </Grid.Column>
              <Grid.Column width={2} />
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
  }

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <Header size='medium' color='blue' style={{ marginBottom: '8px' }}>
                {roster.owner.name}
              </Header>
              <div style={{ fontSize: '0.95em', color: '#666' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                <Statistic horizontal color='blue' size='mini'>
                  <Statistic.Value>{countPoints(roster)}</Statistic.Value>
                  <Statistic.Label>Points</Statistic.Label>
                </Statistic>
                <Statistic horizontal color='blue' size='mini'>
                  <Statistic.Value>{eliminatedPlayers(roster, eliminatedTeams)}/16</Statistic.Value>
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
