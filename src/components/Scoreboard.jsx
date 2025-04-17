import React from 'react';
import useScores from '../hooks/useScores';
import getOrdinals from '../utils/getOrdinals';

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
          {game.gameState === 'OFF' || game.gameState === 'FINAL'
            ? 'Final'
            : game.gameState === 'FUT' || game.gameState === 'PRE'
              ? localDate(game.startTimeUTC)
              : game.clock.timeRemaining + ` ` + game.period + getOrdinals(game.period)}
        </div>
        {/* <br></br> */}
        {/* <br></br>Series: {game.teams.away.leagueRecord.wins} - {game.teams.home.leagueRecord.wins} */}
      </div>
    </div>
  ))

  return (
    <div className='ui center aligned header' style={{ margin: 5, overflow: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'thin' }}>
      <div className='ui small horizontal list '>
        <div className='item'>
          <div className='extra content'>
            <div className='ui small blue label' style={{ padding: '14px' }}>{scoreboard.date ? prettyDate(scoreboard.date) : 'No games scheduled today'}</div>
          </div>
        </div>
        {games}
      </div>
    </div>
  )
}

export default Scoreboard;