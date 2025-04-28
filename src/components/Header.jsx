import React from 'react';
import seasons from '../constants/seasons';
import getOrdinal from '../utils/getOrdinals';


const Header = ({ season }) => {

  const seasonIndex = seasons.seasonList.slice(0).reverse().indexOf(season) + 1;
  const seasonOrdinal = getOrdinal(seasonIndex);

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