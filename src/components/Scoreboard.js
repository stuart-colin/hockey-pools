import React from 'react';
import useScores from '../hooks/useScores';

const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';

const Scoreboard = () => {
  const scoreboard = useScores();

  const gameList = [];
  for (const [index, game] of Object.entries(scoreboard.games)) {
    // gameList.push(game.scores)
    game.status.state == 'LIVE' ?
      gameList.push(
        [
          game.scores,
          game.status.progress.currentPeriodTimeRemaining.pretty,
          game.status.progress.currentPeriodOrdinal,
        ]
      ) : game.status.state == 'FINAL'
        ? gameList.push([game.scores, 'Final', ''])
        : gameList.push([game.scores, 'Coming Up', ''])
  }

  const games = gameList.map(game => (
    <div className="item">
      <div className="ui buttons">
        {/* <img className="ui avatar image" src={logoUrl + '20.svg'} /> */}
        <div className="ui attached button">
          {Object.entries(game[0])[0][0]}
          {`: `}
          {Object.entries(game[0])[0][1]}
        </div>
        {/* <img className="ui avatar image" src={logoUrl + '18.svg'} /> */}
        <div className="ui attached button">
          {Object.entries(game[0])[1][0]}
          {`: `}
          {Object.entries(game[0])[1][1]}
        </div>
        <div className="ui basic attached button">
          {Object.entries(game)[1][1]}
          {` `}
          {Object.entries(game)[2][1]}
        </div>
      </div>
    </div>
  ))

  return (
    <div className="ui center aligned header" style={{ paddingTop: 5 }}>
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