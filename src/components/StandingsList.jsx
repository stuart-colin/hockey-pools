import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dimmer,
  Flag,
  Grid,
  Header,
  Icon,
  List,
  Loader,
  Popup,
  Segment,
} from 'semantic-ui-react';
import { POSITION_ARRAYS } from '../constants/positions';
import Search from './Search';
import StandingsItem from './StandingsItem';
import '../css/customStyle.css';

const StandingsList = ({ hasLiveGames, season, users }) => {
  const [loading, setLoading] = useState(true);
  const [activeRosterKey, setActiveRosterKey] = useState(null);
  const [moversMode, setMoversMode] = useState('standings'); // 'standings' | 'points' | 'rank'
  const itemRefs = useRef({});

  useEffect(() => {
    if (!users.loading) setLoading(false);
  }, [users]);

  const rankedRosters = useMemo(() => {
    if (!users.rosters || users.rosters.length === 0) {
      return [];
    }

    // Derive live points from _delta fields (already baked into player.points)
    const withLivePoints = users.rosters.map(roster => {
      const livePoints = [
        ...POSITION_ARRAYS.flatMap(pos => roster[pos] || []),
        ...(roster.utility ? [roster.utility] : []),
      ].reduce((sum, p) => sum + (p?._delta?.points || 0), 0);
      return { ...roster, livePoints };
    });

    // Rank by total points (including today)
    const sorted = [...withLivePoints].sort((a, b) => b.points - a.points);
    let currentRank = 0;
    let stack = 1;
    let lastPoints = -Infinity;
    const withRank = sorted.map((roster) => {
      if (roster.points !== lastPoints) {
        currentRank += stack;
        stack = 1;
      } else {
        stack++;
      }
      lastPoints = roster.points;
      return { ...roster, rank: currentRank };
    });

    // Base rank by points excluding today's live contribution
    const baseSorted = [...withLivePoints].sort((a, b) => (b.points - b.livePoints) - (a.points - a.livePoints));
    let baseRank = 0;
    let baseStack = 1;
    let lastBasePoints = -Infinity;
    const baseRankMap = {};
    baseSorted.forEach((roster) => {
      const basePoints = roster.points - roster.livePoints;
      if (basePoints !== lastBasePoints) {
        baseRank += baseStack;
        baseStack = 1;
      } else {
        baseStack++;
      }
      lastBasePoints = basePoints;
      baseRankMap[roster.owner.id] = baseRank;
    });

    return withRank.map(roster => ({
      ...roster,
      rankDelta: roster.livePoints > 0 ? baseRankMap[roster.owner.id] - roster.rank : 0,
    }));
  }, [users.rosters]);

  const displayedRosters = useMemo(() => {
    if (moversMode === 'points') return [...rankedRosters].sort((a, b) => b.livePoints - a.livePoints);
    if (moversMode === 'rank') return [...rankedRosters].sort((a, b) => b.rankDelta - a.rankDelta);
    return rankedRosters;
  }, [rankedRosters, moversMode]);

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

  const standingsList = displayedRosters.map((user, index) => (
    <StandingsItem
      hasLiveGames={hasLiveGames}
      isRosterVisible={activeRosterKey === user.owner.id}
      key={user.owner.id}
      onToggleRoster={() => handleToggleRoster(user.owner.id)}
      poolSize={rankedRosters.length}
      rankDelta={user.rankDelta}
      ref={itemRefs.current[user.owner.id]}
      user={user}
    />
  ));

  return (
    <Segment.Group>
      <Segment attached='top' >
        <Grid textAlign='center'>
          <Grid.Row columns={3}>
            <Grid.Column textAlign='left' verticalAlign='middle' width={2}>
              {/* {hasLiveGames && ( */}
              <Popup
                content={
                  moversMode === 'standings' ? "Sort by today's point gains" :
                    moversMode === 'points' ? 'Sort by rank movement' :
                      'Switch to regular standings'
                }
                trigger={
                  <Icon
                    color={moversMode === 'standings' ? 'grey' : moversMode === 'points' ? 'green' : 'yellow'}
                    name='lightning'
                    onClick={() => setMoversMode(m =>
                      m === 'standings' ? 'points' :
                        m === 'points' ? 'rank' :
                          'standings'
                    )}
                    style={{ cursor: 'pointer' }}
                  />
                }
              />
              {/* )} */}
            </Grid.Column>
            <Grid.Column textAlign='center' width={12}>
              <Header color='blue' size='medium' style={{ whiteSpace: 'nowrap' }}>
                {moversMode === 'points' ? "Today's Movers" :
                  moversMode === 'rank' ? "Biggest Climbers" :
                    `${season} Standings`}
              </Header>
            </Grid.Column>
            <Grid.Column width={2}>
              <Popup
                content={
                  <div>
                    Pot: ${pot} <Flag name='canada' />
                  </div>
                }
                trigger={
                  <Icon
                    name='dollar sign'
                    color='green'
                  />
                }
              />

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