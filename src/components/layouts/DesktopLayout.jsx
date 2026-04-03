import React, { Fragment } from 'react';
import { Grid } from 'semantic-ui-react';
import Navigation from '../Navigation';
import Standings from '../Standings';

const DesktopLayout = ({
  activeItem,
  setActiveItem,
  contentMap,
  toggleLiveStats,
  liveStatsEnabled,
  season,
  activeUsers,
  isWide,
}) => {
  return (
    <Fragment>
      <Grid stackable>
        <Grid.Row>
          {isWide && (
            <Grid.Column width={4}>
              <Standings
                liveStatsEnabled={liveStatsEnabled}
                season={season}
                users={activeUsers}
              />
            </Grid.Column>
          )}
          <Grid.Column width={isWide ? 12 : 16}>
            <Navigation
              liveStatsEnabled={liveStatsEnabled}
              onLiveStatsToggle={toggleLiveStats}
              onMenuSelect={setActiveItem}
            />
            {contentMap[activeItem] || null}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  );
};

export default DesktopLayout;
