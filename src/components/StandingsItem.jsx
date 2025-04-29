import React, { useState } from 'react';
import { Transition, Icon, Flag } from 'semantic-ui-react';
import '../css/customStyle.css';
import RosterView from './RosterView';

const URL = 'https://assets.nhle.com/mugs/nhl/default-skater.png';
// const top6 = ['#66b36650', '#7cbe7c50', '#92c99250', '#a7d3a850', '#bddebe50', '#d3e9d350'];
// const top7 = ['#66b36650', '#79bc7850', '#8bc58a50', '#9dce9c50', '#afd7ae50', '#c1e0c150', '#d3e9d350'];
const top10Colors = ['#66b36650', '#66b36650', '#73b97250', '#7fbf7e50', '#8bc58a50', '#97cb9650', '#afd7af50', '#bbddbb50', '#c7e3c750', '#d3e9d350'];


const StandingsItem = ({ user, poolSize }) => {
  const [activeRoster, setActiveRoster] = useState({});
  const [visible, setVisible] = useState(false);

  const toggleRoster = () => {
    setActiveRoster((activeRoster) => !activeRoster)
    setVisible((visible) => !visible)
  }

  const pot = poolSize * 20;
  const prizeDistribution = [0.49, 0.15, 0.10, 0.08, 0.07, 0.04, 0.03, 0.02, 0.01, 0.01];
  const winnings = prizeDistribution.map((percentage) => ` — $${(pot * percentage).toFixed(2)}`);

  const roster = [
    ...user.roster.left,
    ...user.roster.center,
    ...user.roster.right,
    ...user.roster.defense,
    ...user.roster.goalie,
    user.roster.utility,
  ];

  const backgroundColor = user.rank <= 10 ? top10Colors[user.rank - 1] : '';

  return (
    <div className='item' style={{ backgroundColor }}>
      <div className='left floated content'>{user.rank}</div>
      <img className='ui left floated avatar image' src={URL} alt='participant avatar'></img>
      <div className='item'>
        <Icon
          circular
          color='blue'
          name={!visible ? 'chevron right' : 'chevron left'}
          onClick={() => {
            toggleRoster(user.roster);
          }}
          rotated='clockwise'
          size='large'
          className='ui right floated avatar image'
        />
        {/* <div className='header'>{user.roster.owner.name} {user.rank <= 7 ? winnings[user.rank - 1] : ''}</div> */}
        <div className='header'>
          <Flag name={user.roster.owner.country.toLowerCase()} />
          {' '}
          {user.roster.owner.name}
          {' '}
          {/* {user.rank <= 10 ? winnings[user.rank - 1] : ''} */}
        </div>
        <div className={`left floated content playersRemaining${user.playersRemaining}`}>
          {user.playersRemaining}/16
        </div>
        <div className='right floated content'>
          {user.points} Points
        </div>

      </div>
      {!activeRoster ?
        <Transition visible={visible} duration={500}>
          <div className='ui basic segment' style={{ transition: 'all 1s' }}>
            <RosterView
              roster={roster}
            />
          </div>
        </Transition>
        : null
      }
    </div>
  )
}

export default StandingsItem;