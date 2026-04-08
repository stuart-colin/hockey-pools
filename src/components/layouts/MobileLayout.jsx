import React from 'react';

import Navigation from '../Navigation/Navigation';



/**
 * Mobile route shell — plain flex column (no Semantic Grid). SUI Grid rows/columns
 * fight the flex height chain, so the scroll region never gets a bounded height and
 * nothing scrolls while overflow:hidden ancestors clip content.

 */

const MobileLayout = ({
  activeItem,
  setActiveItem,
  contentMap,
  toggleLiveStats,
  liveStatsEnabled,
}) => {
  return (
    <div className='app-mobile-wrapper'>
      <div className='app-mobile-route-scroll app-mobile-page'>
        {contentMap[activeItem] || null}
      </div>

      <Navigation
        liveStatsEnabled={liveStatsEnabled}
        onLiveStatsToggle={toggleLiveStats}
        onMenuSelect={setActiveItem}
      />
    </div>
  );
};

export default MobileLayout;