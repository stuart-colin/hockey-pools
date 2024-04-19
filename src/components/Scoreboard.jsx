import React from 'react';
import useScores from '../hooks/useScores';

const Scoreboard = () => {
  const scoreboard = useScores();

  function localDate(date) {
    let newDate = new Date(date);
    return newDate.toLocaleTimeString(undefined, { timeStyle: 'short' });
  }

  function prettyDate(date) {
    let newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' });
  }

  function getOrdinal(number) {
    if (typeof number !== 'number' || isNaN(number)) {
      return 'Invalid input. Please provide a valid number.';
    }

    const lastDigit = number % 10;
    const secondLastDigit = Math.floor((number % 100) / 10);

    if (secondLastDigit === 1) {
      return `${number}th`;
    } else {
      switch (lastDigit) {
        case 1:
          return `${number}st`;
        case 2:
          return `${number}nd`;
        case 3:
          return `${number}rd`;
        default:
          return `${number}th`;
      }
    }
  }

  const games = scoreboard.games.map((game, index) => (
    <div className='item' key={index}>
      <div className='ui small label'>
        <div className='ui image label' style={{ cursor: 'default' }} >
          <img src={game.awayTeam.logo} alt={game.awayTeam.name.default + ' Logo'} />
          {/* {game.teams.away.team.name} */}
          {/* {`: `} */}
          {game.awayTeam.score}
        </div>
        <div className='ui image label' style={{ cursor: 'default' }} >
          <img src={game.homeTeam.logo} alt={game.homeTeam.name.default + ' Logo'} />
          {/* {game.teams.home.team.name} */}
          {/* {`: `} */}
          {game.homeTeam.score}
        </div>

        <div className='ui label' style={{ cursor: 'default', verticalAlign: 'middle' }} >
          {game.gameState === 'OFF'
            ? 'Final'
            : game.gameState === 'FUT' || game.gameState === 'PRE'
              ? localDate(game.startTimeUTC)
              : game.clock.timeRemaining + ` ` + getOrdinal(game.period)}
        </div>
        {/* <br></br> */}
        {/* <br></br>Series: {game.teams.away.leagueRecord.wins} - {game.teams.home.leagueRecord.wins} */}
      </div>
    </div>
  ))

  return (
    <div className='ui center aligned header' style={{ paddingTop: 5 }}>
      <div className='ui large horizontal list'>
        <div className='item'>
          <div className='extra content'>
            <div className='ui large blue label' style={{ padding: '12px' }}>{scoreboard.date ? prettyDate(scoreboard.date) : 'No games scheduled today'}</div>
          </div>
        </div>
        {games}
      </div>
    </div>
  )
}

export default Scoreboard;