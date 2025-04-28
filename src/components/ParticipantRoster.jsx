import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Icon, Segment, Grid, Header, Statistic, Button } from 'semantic-ui-react';
import StatsCard from './StatsCard';
import StatsSlim from './StatsSlim';
import '../css/customStyle.css';

const ParticipantRoster = ({ selectedRoster, rosterData }) => {
  const [visible, setVisible] = useState(true); // Default to true for expanded view
  const [cardView, setCardView] = useState(); // Default to card view

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    isMobile ? setCardView(true) : setCardView(false)
  }, setCardView)

  if (!selectedRoster) {
    return (
      <Segment.Group>
        <Segment attached='top'>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
                <Icon
                  circular
                  color='blue'
                  name={visible ? 'chevron up' : 'chevron down'}
                />
              </Grid.Column>
              <Grid.Column width={12} textAlign='center'>
                <Header as='h3' color='blue' style={{ whiteSpace: 'nowrap' }}>
                  Select Roster From Standings
                </Header>
              </Grid.Column>
              <Grid.Column width={2} />
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
  }

  const rosterPlayers = rosterData[0].map((player, index) => (
    <Grid.Column key={index}>
      {cardView ? <StatsSlim player={player} /> : <StatsCard player={player} />}
    </Grid.Column>
  ));

  return (
    <Segment.Group>
      {/* Header Segment */}
      <Segment attached='top'>
        <Grid>
          <Grid.Row columns={3}>
            {/* Toggle Visibility Icon */}
            <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
              <Icon
                circular
                color='blue'
                name={visible ? 'chevron up' : 'chevron down'}
              />
            </Grid.Column>
            {/* Roster Owner Details */}
            <Grid.Column width={12} textAlign='center'>
              <Header as='h3' color='blue'>
                {selectedRoster.owner.name}
              </Header>
              <span>
                <i className={`${selectedRoster.owner.country.toLowerCase()} flag`} />
                {selectedRoster.owner.region}
              </span>
            </Grid.Column>
            {/* Pool Points and Players Remaining */}
            <Grid.Column width={2} textAlign='right'>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column width={16} textAlign='center'>
              <Statistic horizontal size='mini' color='blue'>
                <Statistic.Value>{rosterData[1]}</Statistic.Value>
                <Statistic.Label>Pool Points</Statistic.Label>
              </Statistic>
              <Statistic horizontal size='mini' color='blue'>
                <Statistic.Value>{rosterData[2]}/16</Statistic.Value>
                <Statistic.Label>Players Remaining</Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      {/* Content Segment */}
      <Segment
        attached='bottom'
        className={visible ? 'expandedStandingsStyle' : 'collapsedStyle'}
      >
        {visible && (
          <>
            {/* Toggle Card View */}
            <Icon
              icon
              color='blue'
              size='large'
              basic
              onClick={() => setCardView(!cardView)}
              style={{ marginBottom: '10px' }}
              name={cardView ? 'id badge outline' : 'id card outline'}
            />

            {/* Roster Players */}
            <Grid stackable columns={3}>
              {rosterPlayers}
            </Grid>
          </>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default ParticipantRoster;