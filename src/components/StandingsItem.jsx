import React from 'react';
import '../css/customStyle.css';

const URL = 'https://assets.nhle.com/mugs/nhl/default-skater.png';
const top6 = ['#66b36650', '#7cbe7c50', '#92c99250', '#a7d3a850', '#bddebe50', '#d3e9d350'];

const StandingsItem = ({ user, onRosterSelect, poolSize }) => {

  const pot = poolSize * 20;
  const winnings = [
    ' — $' + (pot * 0.65).toFixed(2),
    ' — $' + (pot * 0.15).toFixed(2),
    ' — $' + (pot * 0.09).toFixed(2),
    ' — $' + (pot * 0.06).toFixed(2),
    ' — $' + (pot * 0.03).toFixed(2),
    ' — $' + (pot * 0.02).toFixed(2),
  ];

  const roster = [
    user.user.left[0],
    user.user.left[1],
    user.user.left[2],
    user.user.center[0],
    user.user.center[1],
    user.user.center[2],
    user.user.right[0],
    user.user.right[1],
    user.user.right[2],
    user.user.defense[0],
    user.user.defense[1],
    user.user.defense[2],
    user.user.defense[3],
    user.user.goalie[0],
    user.user.goalie[1],
    user.user.utility,
  ];
  const points = user.points;
  const playersRemaining = user.playersRemaining;

  const rosterData = [roster, points, playersRemaining]

  return (
    <div
      onClick={() => onRosterSelect([user.user, rosterData])}
      className='item'
      style={{ backgroundColor: user.rank <= 6 ? top6[user.rank - 1] : '' }}
    >
      <div className='left floated content'>{user.rank}</div>
      <img
        className='ui left floated avatar image'
        src={URL} alt='participant avatar'></img>
      <div className='item'>
        <div className='header'>{user.user.owner.name} {user.rank <= 6 ? winnings[user.rank - 1] : ''}</div>
        <div className={`left floated content playersRemaining${playersRemaining}`}>{playersRemaining}/16</div>
        <div className='right floated content'>{points} Points</div>
      </div>
    </div>
  )
}

export default StandingsItem;