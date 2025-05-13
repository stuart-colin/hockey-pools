import React, { useState, useEffect, useMemo, useRef, createRef } from 'react';
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
  const [activeRosterKey, setActiveRosterKey] = useState(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (!users.loading) setLoading(false);
  }, [users]);

  const rankedRosters = useMemo(() => {
    if (!users.rosters || users.rosters.length === 0) {
      return [];
    }

    const sorted = [...users.rosters].sort((a, b) => b.points - a.points);
    let currentRank = 0;
    let stack = 1;
    let lastPoints = -Infinity;

    return sorted.map((roster, index) => {
      if (roster.points !== lastPoints) {
        currentRank += stack;
        stack = 1;
      }
      else {
        stack++;
      }
      lastPoints = roster.points;

      return { ...roster, rank: currentRank };
    });
  }, [users.rosters]);

  const pot = rankedRosters.length * 20;

  useEffect(() => {
    itemRefs.current = rankedRosters.reduce((acc, value) => {
      acc[value.owner.id] = acc[value.owner.id] || createRef();
      return acc;
    }, {});
  }, [rankedRosters]);

  const handleToggleRoster = (itemKey) => {
    setActiveRosterKey(prevKey => (prevKey === itemKey ? null : itemKey));
  };

  const handleSearchSelect = (userId) => {
    requestAnimationFrame(() => {
      itemRefs.current[userId].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const standingsList = rankedRosters.map((user, index) => (
    <StandingsItem
      user={user}
      key={user.owner.id}
      poolSize={rankedRosters.length}
      isRosterVisible={activeRosterKey === user.owner.id}
      onToggleRoster={() => handleToggleRoster(user.owner.id)}
      ref={itemRefs.current[user.owner.id]}
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
            <Search
              loading={users.loading}
              rankedRosters={rankedRosters}
              placeholder={'Search Rosters'}
              onSearchResultClick={handleSearchSelect}
            />
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment
        attached='bottom'
        className={'expandedStandingsStyle'}
        style={{
          padding: 0,
          scrollbarWidth: 'thin'
        }}
      >
        {loading ? (
          <Dimmer active inverted>
            <Loader>Loading Standings...</Loader>
          </Dimmer>
        ) : (
          <List animated divided relaxed selection>
            {standingsList}
          </List>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default StandingsList;