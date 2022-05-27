import React from 'react';
import useScores from '../hooks/useScores';

const Header = () => {
  return (
    <h1 className='ui center aligned icon header'>
      <img src='https://upload.wikimedia.org/wikipedia/commons/6/6a/Ice_hockey_puck.svg' style={{ width: 100 }} alt='hockey puck icon' />
      <div className='content'>
        <em className='ui blue header'>BP's Annual Hockey Pool</em>
      </div>
      <div className='ui horizontal divider'>
        17th
      </div>
    </h1>
  )
}

export default Header;