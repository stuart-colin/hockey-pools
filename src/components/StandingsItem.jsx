import React from 'react';
import '../css/customStyle.css';

const URL = 'https://assets.nhle.com/mugs/nhl/default-skater.png';
const top6 = ['#66b36650', '#7cbe7c50', '#92c99250', '#a7d3a850', '#bddebe50', '#d3e9d350'];
const pot = 84 * 20;
const winnings = [
  ' — $' + (pot * 0.65).toFixed(2),
  ' — $' + (pot * 0.15).toFixed(2),
  ' — $' + (pot * 0.09).toFixed(2),
  ' — $' + (pot * 0.06).toFixed(2),
  ' — $' + (pot * 0.03).toFixed(2),
  ' — $' + (pot * 0.02).toFixed(2),
];

const StandingsItem = ({ user, onRosterSelect, index }) => {


  const roster = [
    user.roster.left[0],
    user.roster.left[1],
    user.roster.left[2],
    user.roster.center[0],
    user.roster.center[1],
    user.roster.center[2],
    user.roster.right[0],
    user.roster.right[1],
    user.roster.right[2],
    user.roster.defense[0],
    user.roster.defense[1],
    user.roster.defense[2],
    user.roster.defense[3],
    user.roster.goalie[0],
    user.roster.goalie[1],
    user.roster.utility,
  ];

  const points = user.points;
  const playersRemaining = user.playersRemaining;

  const rosterData = [points, playersRemaining, roster]

  return (
    <div
      onClick={() => onRosterSelect([user.roster, rosterData])}
      className='item'
      style={{ backgroundColor: index <= 5 ? top6[index] : '' }}
    >
      <div className='left floated content'>{index + 1}</div>
      <img
        className='ui left floated avatar image'
        src={URL} alt='participant avatar'></img>
      <div className='item'>
        <div className='header'>{user.roster.owner.name} {index <= 5 ? winnings[index] : ''}</div>
        <div className={`left floated content playersRemaining${playersRemaining}`}>{playersRemaining}/16</div>
        <div className='right floated content'>{points} Points</div>
      </div>
    </div>
  )
}

export default StandingsItem;