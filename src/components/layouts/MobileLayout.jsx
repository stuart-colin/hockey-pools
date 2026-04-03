import React, { Fragment } from 'react';
import { Grid } from 'semantic-ui-react';
import Navigation from '../Navigation';

const MobileLayout = ({
  activeItem,
  setActiveItem,
  contentMap,
  toggleLiveStats,
  liveStatsEnabled,
  season,
  activeUsers,
  isMobile,
  isTablet,
}) => {
  return (
    <Fragment>
      <Grid
        stackable
        style={{
          position: 'fixed',
          left: isMobile ? -15 : 0,
          right: isMobile ? -15 : 0,
        }}
      >
        <Grid.Row>
          <Grid.Column width={16}>
            {contentMap[activeItem] || null}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Navigation
        liveStatsEnabled={liveStatsEnabled}
        onLiveStatsToggle={toggleLiveStats}
        onMenuSelect={setActiveItem}
      />
    </Fragment>
  );
};

export default MobileLayout;
