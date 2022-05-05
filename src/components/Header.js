import React from 'react';
import useScores from '../hooks/useScores';

const Header = () => {
  const scoreboard = useScores();
  for (const [day, game] of Object.entries(scoreboard.games)) {
    console.log(game.scores);
  }

  return (
    <h1 className="ui center aligned icon header">
      {scoreboard.date}
      {/* {Object.keys(scoreboard.games).map((game, index) => (
        <span key={index}> {game}</span>
      ))} */}
      {for (const [day, game] of Object.entries(scoreboard.games)) {
        { game.scores };
      }}
      <i className="hockey puck icon" />
      <div className="content">
        <em className="ui blue header">BP's Annual Hockey Pool</em>
      </div>
      <div className="ui horizontal divider">
        17th
      </div>
    </h1>
  )
}

export default Header;