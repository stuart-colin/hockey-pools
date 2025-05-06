import React, { useState, useEffect, useMemo } from 'react';
import {
  Dimmer,
  Flag,
  Grid,
  Header,
  List,
  Loader,
  Segment,
} from 'semantic-ui-react';
import Search from './Search';
import StandingsItem from './StandingsItem';
import '../css/customStyle.css';

const StandingsList = ({ users, season }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!users.loading) setLoading(false);
  }, [users]);

  const rankedRosters = useMemo(() => {
    if (!users.rosters || users.rosters.length === 0) {
      return [];
    }

    // 1. Create a shallow copy and sort by points descending
    const sorted = [...users.rosters].sort((a, b) => b.points - a.points);

    // 2. Calculate ranks immutably
    let currentRank = 0;
    let stack = 1;
    let lastPoints = -Infinity; // Start with a value lower than any possible points

    return sorted.map((roster, index) => {
      if (roster.points !== lastPoints) {
        currentRank += stack;
        stack = 1; // Reset stack for the new rank
      }
      else {
        stack++; // Increment stack for tied rank
      }
      lastPoints = roster.points; // Update lastPoints for the next iteration

      // Return a new object with the rank added
      return { ...roster, rank: currentRank };
    });
  }, [users.rosters]); // Only recalculate when users.rosters changes

  const pot = rankedRosters.length * 20;

  const renderedList = rankedRosters.map((user, index) => (
    <StandingsItem
      user={user}
      key={index}
      index={index}
      poolSize={rankedRosters.length}
    />
  ));

  return (
    <Segment.Group>
      <Segment attached='top' >
        <Grid textAlign='center'>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Column width={12}>
              <Header size='medium' color='blue' textAlign='center' style={{ flex: 1 }}>
                {season} Standings
              </Header>
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Row>
              Pot: ${pot} <Flag name='canada' />
            </Grid.Row>
          </Grid.Row>
          <Grid.Row columns={12}>
            <Search loading={users.loading} rankedRosters={rankedRosters} placeholder={'Search Rosters'} />
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment attached='bottom' className={'expandedStandingsStyle'}>
        {loading ? (
          <Dimmer active inverted>
            <Loader>Loading Standings...</Loader>
          </Dimmer>
        ) : (
          <List divided relaxed selection>{renderedList}</List>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default StandingsList;