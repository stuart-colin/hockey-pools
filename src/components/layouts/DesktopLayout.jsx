import React, { Fragment } from 'react';
import { Grid } from 'semantic-ui-react';
import Navigation from '../Navigation/Navigation';
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
      <div className='app-desktop-root'>
        <Grid stackable>
          <Grid.Row>
            {isWide && (
              <Grid.Column width={4}>
                <div className='app-page-column'>
                  <Standings
                    liveStatsEnabled={liveStatsEnabled}
                    season={season}
                    users={activeUsers}
                  />
                </div>
              </Grid.Column>
            )}
            <Grid.Column width={isWide ? 12 : 16}>
              <div className='app-desktop-content'>
                <Navigation
                  liveStatsEnabled={liveStatsEnabled}
                  onLiveStatsToggle={toggleLiveStats}
                  onMenuSelect={setActiveItem}
                />
                <div className='app-desktop-content-scroll app-fill-scroll'>
                  {contentMap[activeItem] || null}
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Fragment>
  );
};

export default DesktopLayout;
