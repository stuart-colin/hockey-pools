import React, { useState, useMemo } from 'react';
import { Label, List, Segment } from 'semantic-ui-react';
import useScores from '../../hooks/useScores';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import DateLabel from './Scoreboard.DateLabel';
import GameCard from './Scoreboard.GameCard';

/* In-flow strip at top of .app-shell — avoids padding-top / 100dvh offset hacks */
const scoreboardSegmentStyle = {
  overflowX: 'auto',
  marginBottom: 0,
  whiteSpace: 'nowrap',
  padding: 5,
  backgroundColor: 'white',
  width: '100%',
  zIndex: 10,
};

const isFinished = (game) => game.gameState === 'OFF' || game.gameState === 'FINAL';

// Navigation is anchored on the NHL API's own prevDate/nextDate values so the
// "day" always matches the league's logical rollover (noon ET) rather than the
// user's local system date.
const Scoreboard = ({ todayScores }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const otherDateScores = useScores(selectedDate, { skip: selectedDate === null });
  const scoreboard = selectedDate === null ? todayScores : otherDateScores;
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
          isOffDate={selectedDate !== null}
          canGoNext={Boolean(scoreboard.nextDate)}
          canGoPrev={Boolean(scoreboard.prevDate)}
          onNext={() => {
            if (scoreboard.nextDate) setSelectedDate(scoreboard.nextDate);
          }}
          onPrev={() => {
            if (scoreboard.prevDate) setSelectedDate(scoreboard.prevDate);
          }}
          onReset={() => setSelectedDate(null)}
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
