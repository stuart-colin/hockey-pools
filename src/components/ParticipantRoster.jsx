import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Grid, Header, Icon, Segment, Statistic } from 'semantic-ui-react';
import StatsCard from './StatsCard';
import StatsSlim from './StatsSlim';
import rosterPositions from '../constants/rosterPositions';
import eliminatedPlayers from '../utils/eliminatedPlayers';
import countPoints from '../utils/countPoints';
import useMyTeam from '../hooks/useMyTeam'; // Import the custom hook
import '../css/customStyle.css';

const ParticipantRoster = ({ rosterDataEndpoint }) => {
  const { roster, error, isLoading } = useMyTeam(rosterDataEndpoint); // Use the custom hook
  const [visible, setVisible] = useState(true);
  const [cardView, setCardView] = useState();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useState(() => {
    isMobile ? setCardView(true) : setCardView(false);
  }, [isMobile]);

  if (isLoading) {
    return <Segment loading>Loading roster...</Segment>;
  }

  if (error) {
    return <Segment>Error: {error}</Segment>;
  }

  if (!roster) {
    return (
      <Segment.Group>
        <Segment attached="top">
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
                <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
              </Grid.Column>
              <Grid.Column width={12} textAlign="center">
                <Header as="h3" color="blue" style={{ whiteSpace: 'nowrap' }}>
                  No Roster Found
                </Header>
                Please sign in to see your roster.
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
        <Header as="h4" color="blue">
          {position.charAt(0).toUpperCase() + position.slice(1)}
        </Header>
        {playersInPosition.map((player, playerIndex) => (
          <div key={playerIndex}>
            {cardView ? <StatsSlim player={player} /> : <StatsCard player={player} />}
          </div>
        ))}
      </Grid.Column>
    );
  });

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
              <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
            </Grid.Column>
            <Grid.Column width={12} textAlign="center">
              <Header as="h3" color="blue">
                {roster.owner.name}
              </Header>
              <span>
                <i className={`${roster.owner.country.toLowerCase()} flag`} />
                {roster.owner.region}
              </span>
            </Grid.Column>
            <Grid.Column width={2} textAlign="right"></Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column width={16} textAlign="center">
              <Statistic horizontal size="mini" color="blue">
                <Statistic.Value>{countPoints(roster)}</Statistic.Value>
                <Statistic.Label>Pool Points</Statistic.Label>
              </Statistic>
              <Statistic horizontal size="mini" color="blue">
                <Statistic.Value>{eliminatedPlayers(roster)}/16</Statistic.Value>
                <Statistic.Label>Players Remaining</Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment
        attached="bottom"
        className={visible ? 'expandedRosterStyle' : 'collapsedStyle'}
      >
        {visible && (
          <>
            <Grid stackable columns={3}>{rosterPlayers}</Grid>
          </>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default ParticipantRoster;