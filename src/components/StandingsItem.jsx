import React, { useState } from 'react';
import { Transition, Icon } from 'semantic-ui-react';
import '../css/customStyle.css';
import RosterView from './RosterView';

const URL = 'https://assets.nhle.com/mugs/nhl/default-skater.png';
// const top6 = ['#66b36650', '#7cbe7c50', '#92c99250', '#a7d3a850', '#bddebe50', '#d3e9d350'];
const top7 = ['#66b36650', '#79bc7850', '#8bc58a50', '#9dce9c50', '#afd7ae50', '#c1e0c150', '#d3e9d350'];

const StandingsItem = ({ user, onRosterSelect, poolSize }) => {
  const [activeRoster, setActiveRoster] = useState({});
  const [visible, setVisible] = useState(false);

  // console.log(activeRoster)

  const toggleRoster = () => {
    setActiveRoster((activeRoster) => !activeRoster)
    setVisible((visible) => !visible)
  }

  const pot = poolSize * 20;
  // const winnings = [
  //   ' — $' + (pot * 0.65).toFixed(2),
  //   ' — $' + (pot * 0.15).toFixed(2),
  //   ' — $' + (pot * 0.09).toFixed(2),
  //   ' — $' + (pot * 0.06).toFixed(2),
  //   ' — $' + (pot * 0.03).toFixed(2),
  //   ' — $' + (pot * 0.02).toFixed(2),
  // ];
  const winnings = [
    ' — $' + (pot * 0.65).toFixed(2),
    ' — $' + (pot * 0.14).toFixed(2),
    ' — $' + (pot * 0.08).toFixed(2),
    ' — $' + (pot * 0.05).toFixed(2),
    ' — $' + (pot * 0.04).toFixed(2),
    ' — $' + (pot * 0.02).toFixed(2),
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
      onClick={() => {
        onRosterSelect([user.user, rosterData]);
      }}
      className='item'
      style={{ backgroundColor: user.rank <= 7 ? top7[user.rank - 1] : '' }}
    >
      <div className='left floated content'>{user.rank}</div>
      <img
        className='ui left floated avatar image'
        src={URL} alt='participant avatar'></img>
      <div className='item'>
        <Icon
          circular
          color='blue'
          name={!visible ? 'chevron right' : 'chevron left'}
          onClick={() => {
            toggleRoster(user.user);
          }}
          rotated='clockwise'
          size='large'
          className='ui right floated avatar image'
        />
        {/* <div className='header'>{user.user.owner.name} {user.rank <= 6 ? winnings[user.rank - 1] : ''}</div> */}
        <div className='header'>
          {user.user.owner.name}
        </div>
        <div className={`left floated content playersRemaining${playersRemaining}`}>
          {playersRemaining}/16
        </div>
        <div className='right floated content'>
          {points} Points
        </div>

      </div>
      {!activeRoster ?
        <Transition visible={visible} duration={500}>
          <div className='ui basic segment' style={{ transition: 'all 1s' }}>
            <RosterView
              selectedRoster={user.user}
              rosterData={rosterData}
            />
          </div>
        </Transition>
        : null
      }
    </div>
  )
}

export default StandingsItem;