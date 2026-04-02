import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimmer,
  List,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { POSITION_ARRAYS } from '../../constants/positions';
import Search from '../Search';
import StandingsItem from './Standings.Item';
import StandingsListHeader from './Standings.ListHeader';
import '../../css/customStyle.css';
import useIsMobile from '../../hooks/useBreakpoint';

const Standings = ({ liveStatsEnabled, season, users }) => {
  const [loading, setLoading] = useState(true);
  const [activeRosterKey, setActiveRosterKey] = useState(null);
  const [moversMode, setMoversMode] = useState('standings'); // 'standings' | 'points' | 'rank'
  const itemRefs = useRef({});
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!users.loading) setLoading(false);
  }, [users.loading]);

  const rankedRosters = useMemo(() => {
    if (!users.rosters || users.rosters.length === 0) {
      return [];
    }

    // Derive live points from _delta fields (already baked into player.points)
    const withLivePoints = users.rosters.map((roster) => {
      const livePoints = [
        ...POSITION_ARRAYS.flatMap((pos) => roster[pos] || []),
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
        stack += 1;
      }
      lastPoints = roster.points;
      return { ...roster, rank: currentRank };
    });

    // Base rank by points excluding today's live contribution
    const baseSorted = [...withLivePoints].sort(
      (a, b) => (b.points - b.livePoints) - (a.points - a.livePoints)
    );
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
        baseStack += 1;
      }
      lastBasePoints = basePoints;
      baseRankMap[roster.owner.id] = baseRank;
    });

    return withRank.map((roster) => ({
      ...roster,
      rankDelta: roster.livePoints > 0 ? baseRankMap[roster.owner.id] - roster.rank : 0,
    }));
  }, [users.rosters]);

  const displayedRosters = useMemo(() => {
    if (moversMode === 'points') {
      return [...rankedRosters].sort((a, b) => b.livePoints - a.livePoints);
    }
    if (moversMode === 'rank') {
      return [...rankedRosters].sort((a, b) => b.rankDelta - a.rankDelta);
    }
    return rankedRosters;
  }, [rankedRosters, moversMode]);

  const pot = rankedRosters.length * 20;

  useEffect(() => {
    const newRefs = {};
    rankedRosters.forEach((roster) => {
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
    setActiveRosterKey((prevKey) => (prevKey === itemKey ? null : itemKey));
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

  const handleMoversToggle = (mode) => {
    setMoversMode(mode);
  };

  const standingsList = displayedRosters.map((user) => (
    <StandingsItem
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
      <Segment attached="top">
        <StandingsListHeader
          liveStatsEnabled={liveStatsEnabled}
          moversMode={moversMode}
          onMoversToggle={handleMoversToggle}
          pot={pot}
          season={season}
        />
        <Search
          loading={users.loading}
          onSearchResultClick={handleSearchSelect}
          placeholder="Search Rosters"
          rankedRosters={rankedRosters}
        />
      </Segment>
      <Segment
        attached="bottom"
        style={{
          maxHeight: isMobile ? 'calc(100dvh - 215px)' : 'calc(100dvh - 471px)',
          overflow: 'auto',
          padding: 0,
        }}
      >
        {loading ? (
          <Dimmer
            active
            inverted
          >
            <Loader>Loading Standings...</Loader>
          </Dimmer>
        ) : (
          <List
            animated
            divided
            relaxed
            selection
          >
            {standingsList}
          </List>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default Standings;
