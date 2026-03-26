import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    const newRefs = {};
    rankedRosters.forEach(roster => {
      if (roster.owner?.id) {
        // Preserve existing refs to prevent recreating DOM nodes
        if (itemRefs.current[roster.owner.id]) {
          newRefs[roster.owner.id] = itemRefs.current[roster.owner.id];
        } else {
          newRefs[roster.owner.id] = React.createRef();
        }
      }
    });
    itemRefs.current = newRefs;
  }, [rankedRosters]);

  const handleToggleRoster = (itemKey) => {
    setActiveRosterKey(prevKey => (prevKey === itemKey ? null : itemKey));
  };

  const handleSearchSelect = (userId) => {
    const selectedRef = itemRefs.current[userId];
    if (!selectedRef?.current) return;

    requestAnimationFrame(() => {
      selectedRef.current.scrollIntoView({
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
            <Grid.Column width={12} textAlign='center'>
              <Header size='medium' color='blue' style={{ whiteSpace: 'nowrap' }}>
                {season} Standings
              </Header>
              Pot: ${pot} <Flag name='canada' />
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Search
          loading={users.loading}
          rankedRosters={rankedRosters}
          placeholder={'Search Rosters'}
          onSearchResultClick={handleSearchSelect}
        />
      </Segment>
      <Segment
        attached='bottom'
        className={'expandedStandingsStyle'}
        style={{
          padding: 0,
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