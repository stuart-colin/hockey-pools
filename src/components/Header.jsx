import React from 'react';
import seasons from '../constants/seasons';
import getOrdinal from '../utils/getOrdinals';


const Header = ({ season }) => {

  const seasonIndex = seasons.seasonList.indexOf(season) + 1;
  const seasonOrdinal = getOrdinal(seasonIndex);

  return (
    <h1 className='ui center aligned icon header'>
      <div className='content'>
        <img src='https://upload.wikimedia.org/wikipedia/commons/6/6a/Ice_hockey_puck.svg' style={{ width: 60, position: 'relative', top: '0.5em', left: '-0.5em' }} alt='hockey puck icon' />
        <em className='ui blue header'>BP's Annual Hockey Pool</em>
      </div>
      <div className='ui horizontal divider'>
        {seasonIndex + seasonOrdinal}
      </div>
    </h1>
  )
}

export default Header;