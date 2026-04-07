import React, { useState, useMemo } from 'react';
import { Label, List, Segment } from 'semantic-ui-react';
import useScores from '../../hooks/useScores';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import DateLabel from './Scoreboard.DateLabel';
import GameCard from './Scoreboard.GameCard';

/* In-flow strip at top of .app-shell — avoids padding-top / 100dvh offset hacks */
const scoreboardSegmentStyle = {
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  padding: 5,
  backgroundColor: 'white',
  width: '100%',
  zIndex: 10,
};

const formatDateParam = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isFinished = (game) => game.gameState === 'OFF' || game.gameState === 'FINAL';

const Scoreboard = ({ todayScores }) => {
  const [dateOffset, setDateOffset] = useState(0);

  const dateParam = useMemo(() => {
    if (dateOffset === 0) return null;
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return formatDateParam(d);
  }, [dateOffset]);

  // Only fetch independently when viewing a different date; reuse App's today fetch otherwise
  const otherDateScores = useScores(dateParam, { skip: dateOffset === 0 });
  const scoreboard = dateOffset === 0 ? todayScores : otherDateScores;
  const { isMobile } = useBreakpoint();

  const sortedGames = useMemo(() => {
    if (!scoreboard.games || !Array.isArray(scoreboard.games)) {
      return [];
    }

    return [...scoreboard.games].sort((a, b) => {
      const aFinished = isFinished(a);
      const bFinished = isFinished(b);

      if (aFinished && !bFinished) return 1;
      if (!aFinished && bFinished) return -1;

      return new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime();
    });
  }, [scoreboard.games]);

  return (
    <Segment
      className='app-scoreboard'
      style={scoreboardSegmentStyle}
      textAlign='center'
    >
      <List horizontal>
        <DateLabel
          date={scoreboard.date}
          dateOffset={dateOffset}
          onNext={() => setDateOffset(prev => prev + 1)}
          onPrev={() => setDateOffset(prev => prev - 1)}
          onReset={() => setDateOffset(0)}
        />
        {sortedGames.length > 0
          ? sortedGames.map((game, index) => (
            <GameCard
              game={game}
              isMobile={isMobile}
              key={game.gamePk || index}
            />
          ))
          : <Label>No games scheduled today</Label>
        }
      </List>
    </Segment>
  );
};

export default Scoreboard;
