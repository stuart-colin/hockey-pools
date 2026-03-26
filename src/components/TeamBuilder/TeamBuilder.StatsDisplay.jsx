import React from 'react';

/**
 * Displays player stats in a vertically aligned, easy-to-read format
 * Skaters: GP, Goals, Assists, Points (2x2 grid)
 * Goalies: GP, Wins, Losses, OTL (2x2 grid)
 */
const StatsDisplay = ({ player }) => {
  const { positionCode, gamesPlayed } = player;

  if (positionCode === 'G') {
    const { wins, losses, otLosses } = player;
    return (
      <div>
        <div>
          <span>GP</span>
          <span>{gamesPlayed}</span>
        </div>
        <div>
          <span>W</span>
          <span>{wins}</span>
        </div>
        <div>
          <span>L</span>
          <span>{losses}</span>
        </div>
        <div>
          <span>OTL</span>
          <span>{otLosses}</span>
        </div>
      </div>
    );
  }

  // Skaters
  const { goals, assists, points } = player;
  return (
    <div>
      <div>
        <span>GP</span>
        <span>{gamesPlayed}</span>
      </div>
      <div>
        <span>G</span>
        <span>{goals}</span>
      </div>
      <div>
        <span>A</span>
        <span>{assists}</span>
      </div>
      <div>
        <span>P</span>
        <span>{points}</span>
      </div>
    </div>
  );
};

export default StatsDisplay;
