import React from 'react';
import useScores from '../hooks/useScores';

const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';

const Scoreboard = () => {
  const scoreboard = useScores();

  const games = scoreboard.games.map(game => (
    <div className="item">
      <div className="content">
        <div className="header">
          {/* <img className="ui avatar image" src={logoUrl + '20.svg'} /> */}
          {Object.entries(game)[0][0]}: {Object.entries(game)[0][1]}
          -
          {/* <img className="ui avatar image" src={logoUrl + '18.svg'} /> */}
          {Object.entries(game)[1][0]}: {Object.entries(game)[1][1]}
        </div>
      </div>
    </div>
  ))

  return (
    <div className="ui center aligned">
      <div className="ui small horizontal divided list">
        Scores for {scoreboard.date}: {games}
      </div>
    </div>
  )
}

export default Scoreboard;