import React from 'react';
import getSeasonOrdinal from '../utils/getSeasonOrdinal';


const Header = ({ season }) => {
  const seasonOrdinal = getSeasonOrdinal(season);

  return (
    <h1 className='ui center aligned icon header'>
      <div className='content'>
        <img
          src='/public/../logo.svg'
          style={{
            width: 250,
            paddingTop: 25,
            position: 'relative',
          }}
          alt='bps annual hockey pool logo' />
      </div>
    </h1>
  )
}

export default Header;