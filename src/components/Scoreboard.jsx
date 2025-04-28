import React from 'react';
import { List, Label, Image, Segment, Header, Icon } from 'semantic-ui-react';
import useScores from '../hooks/useScores';
import getOrdinals from '../utils/getOrdinals';

const Scoreboard = () => {
  const scoreboard = useScores();

  function localDate(date) {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString(undefined, { timeStyle: 'short' });
  }

  function prettyDate(date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  const games = scoreboard.games.map((game, index) => (
    <List.Item key={index}>
      <Label>
        <Image avatar src={game.awayTeam.logo} alt={`${game.awayTeam.name.default} Logo`} />
        <Label>
          {game.awayTeam.score}
        </Label>
        <Image avatar src={game.homeTeam.logo} alt={`${game.homeTeam.name.default} Logo`} />
        <Label>
          {game.homeTeam.score}
        </Label>
        <Label>
          {game.gameState === 'OFF' || game.gameState === 'FINAL'
            ? 'Final'
            : game.gameState === 'FUT' || game.gameState === 'PRE'
              ? localDate(game.startTimeUTC)
              : `${game.clock.timeRemaining}
          ${game.period}${getOrdinals(game.period)}
          ${game.clock.inIntermission ? 'INT' : ''}`}
        </Label>
      </Label>
    </List.Item>
  ));

  return (
    <Segment
      textAlign='center'
      style={{
        position: 'fixed',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'thin',
        padding: 5,
        top: 0,
        backgroundColor: 'white',
        width: '100vw',
        zIndex: '1000',
      }}
    >

      <List horizontal>
        <Label color='blue'>
          <Icon size='large' name='calendar outline' />
          {scoreboard.date ? prettyDate(scoreboard.date) : 'No games scheduled today'}
        </Label>
        {games}
      </List>
    </Segment>
  );
};

export default Scoreboard;