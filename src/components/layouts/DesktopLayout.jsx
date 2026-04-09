import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import CommissionersCorner from '../CommissionersCorner';
import DevTools from '../DevTools';
import Insights from '../Insights';
import MyTeam from '../MyTeam';
import Navigation from '../Navigation/Navigation';
import PlayerDetails from '../PlayerDetails';
import Standings from '../Standings';
import TeamBuilder from '../TeamBuilder/TeamBuilder';
import TeamDetails from '../TeamDetails';

import { APP_CONFIG } from '../../config/appConfig';

const DesktopLayout = ({
  toggleLiveStats,
  liveStatsEnabled,
  season,
  activeUsers,
  players,
  unselectedPlayers,
  regularSeasonStats,
  playerDeltas,
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
                />
                <div className='app-desktop-content-scroll app-fill-scroll'>
                  <Routes>
                    <Route path="/admin" element={<DevTools />} />
                    <Route path="/commissioners-corner" element={<CommissionersCorner season={season} />} />
                    <Route path="/insights" element={<Insights players={players} regularSeasonStats={regularSeasonStats} season={season} users={activeUsers} unselectedPlayers={unselectedPlayers} />} />
                    <Route path="/my-team" element={<MyTeam playerDeltas={playerDeltas} rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint} />} />
                    <Route path="/player-details" element={<PlayerDetails players={players} season={season} users={activeUsers} unselectedPlayers={unselectedPlayers} />} />
                    <Route path="/standings" element={<Standings liveStatsEnabled={liveStatsEnabled} season={season} users={activeUsers} />} />
                    <Route path="/team-builder" element={<TeamBuilder regularSeasonStats={regularSeasonStats} rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint} />} />
                    <Route path="/team-details" element={<TeamDetails players={players} season={season} users={activeUsers} />} />
                    <Route path="/" element={<Insights players={players} regularSeasonStats={regularSeasonStats} season={season} users={activeUsers} unselectedPlayers={unselectedPlayers} />} />
                  </Routes>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Fragment>
  );
};

export default React.memo(DesktopLayout);
