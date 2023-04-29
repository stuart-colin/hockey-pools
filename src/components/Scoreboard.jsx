import React from 'react';
import useScores from '../hooks/useScores';

const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';

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
          <img src={logoUrl + game.teams.away.team.id + '.svg'} alt={game.teams.away.team.name + ' Logo'} />
          {/* {game.teams.away.team.name} */}
          {/* {`: `} */}
          {game.teams.away.score}
        </div>
        <div className='ui image label' style={{ cursor: 'default' }} >
          <img src={logoUrl + game.teams.home.team.id + '.svg'} alt={game.teams.home.team.name + ' Logo'} />
          {/* {game.teams.home.team.name} */}
          {/* {`: `} */}
          {game.teams.home.score}
        </div>

        <div className='ui label' style={{ cursor: 'default', verticalAlign: 'middle' }} >
          {game.status.abstractGameState === 'Final'
            ? game.status.abstractGameState
            : game.status.abstractGameState === 'Preview'
              ? localDate(game.gameDate)
              : game.linescore.currentPeriodTimeRemaining + ` ` + game.linescore.currentPeriodOrdinal}
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