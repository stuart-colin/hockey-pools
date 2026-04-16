import React from 'react';
import { APP_CONFIG } from '../config/appConfig';
import getSeasonOrdinal from '../utils/getSeasonOrdinal';

const logoStyle = {
  width: 250,
  paddingTop: 25,
  position: 'relative',
};

const Header = ({ season }) => {
  const seasonOrdinal = getSeasonOrdinal(season);

  return (
    <h1 className='ui center aligned icon header'>
      <div className='content'>
        <img
          alt='bps annual hockey pool logo'
          src={APP_CONFIG.logoPath}
          style={logoStyle}
        />
      </div>
    </h1>
  )
}

export default Header;