import React from 'react';
import useScores from '../hooks/useScores';

const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';

const Scoreboard = () => {
  const scoreboard = useScores();

  const games = scoreboard.games.map(game => (
    <div className="item">
      {/* <img className="ui avatar image" src={logoUrl + '20.svg'} /> */}
      <a className="ui large label">
        {Object.entries(game)[0][0]}: {Object.entries(game)[0][1]}
      </a>
      {/* <img className="ui avatar image" src={logoUrl + '18.svg'} /> */}
      <a className="ui large label">
        {Object.entries(game)[1][0]}: {Object.entries(game)[1][1]}
      </a>
    </div>
  ))

  return (
    <div className="ui center aligned header">
      <div className="ui large horizontal list">
        <div className="item">
          <div className="extra content">
            <a className="ui large blue label">{scoreboard.date}</a>
          </div>
        </div>
        {games}
      </div>
    </div>
  )
}

export default Scoreboard;