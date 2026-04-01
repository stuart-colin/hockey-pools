import React, { useMemo, useState } from 'react';
import {
  Flag,
  Grid,
  Header,
  Icon,
  Segment,
  Statistic
} from 'semantic-ui-react';
import useIsMobile from '../hooks/useIsMobile';
import StatsCard from './StatsCard';
import StatsSlim from './StatsSlim';
import rosterPositions from '../constants/rosterPositions';
import eliminatedPlayers from '../utils/eliminatedPlayers';
import normalizePlayer from '../utils/normalizePlayer';
import { augmentRoster } from '../utils/parseLiveStats';
import { useEliminatedTeamsContext } from '../context/EliminatedTeamsContext';
import countPoints from '../utils/countPoints';
import useMyTeam from '../hooks/useMyTeam';
import { POSITION_ARRAYS } from '../constants/positions';
import '../css/customStyle.css';

const ParticipantRoster = ({ playerDeltas, rosterDataEndpoint }) => {
  const { eliminatedTeams } = useEliminatedTeamsContext();
  const { roster: rawRoster, error, isLoading } = useMyTeam(rosterDataEndpoint);
  const isMobile = useIsMobile();
  const [cardView, setCardView] = useState(isMobile);

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
          <div style={{ paddingBottom: '10px' }} key={playerIndex}>
            {cardView ? <StatsSlim player={player} /> : <StatsCard player={player} />}
          </div>
        ))}
      </Grid.Column>
    );
  });

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column width={2} />
            <Grid.Column width={12} textAlign='center'>
              <Header size='medium' color='blue'>
                {roster.owner.name}
              </Header>
              <span>
                {roster.owner && roster.owner.country && roster.owner.country.toLowerCase() !== 'n/a' &&
                  <Flag name={roster.owner.country.toLowerCase()} />
                }
                {roster.owner.region}
              </span>
            </Grid.Column>
            <Grid.Column width={2} textAlign='right'>
              <Icon
                color='blue'
                size='large'
                onClick={() => setCardView(!cardView)}
                style={{ marginBottom: '10px', cursor: 'pointer' }}
                name={cardView ? 'id badge outline' : 'id card outline'}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column width={16} textAlign='center'>
              <Statistic horizontal size='mini' color='blue'>
                <Statistic.Value>{countPoints(roster)}</Statistic.Value>
                <Statistic.Label>Pool Points</Statistic.Label>
              </Statistic>
              <Statistic horizontal size='mini' color='blue'>
                <Statistic.Value>{eliminatedPlayers(roster, eliminatedTeams)}/16</Statistic.Value>
                <Statistic.Label>Players Remaining</Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment attached='bottom' className={'expandedRosterStyle'}>
        <Grid stackable columns={3}>{rosterPlayers}</Grid>
      </Segment>
    </Segment.Group>
  );
};

export default ParticipantRoster;