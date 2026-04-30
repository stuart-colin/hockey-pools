import React, { Fragment, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Grid, Loader } from 'semantic-ui-react';

import CommissionersCorner from '../CommissionersCorner';
import DevTools from '../DevTools';
import Insights from '../Insights';
import MyTeam from '../MyTeam';
import Navigation from '../Navigation/Navigation';
import PlayerDetails from '../PlayerDetails';
import PlayoffLocked from '../PlayoffLocked';
import Standings from '../Standings';
import TeamBuilder from '../TeamBuilder/TeamBuilder';
import TeamDetails from '../TeamDetails';

import useIsAdmin from '../../hooks/useIsAdmin';
import usePlayoffLock from '../../hooks/usePlayoffLock';

import { APP_CONFIG } from '../../config/appConfig';

// Lazy so the recharts bundle (~70 KB gz) only ships when someone visits /history.
const History = lazy(() => import('../History/History'));

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
  const { hasStarted } = usePlayoffLock();
  const isAdmin = useIsAdmin();
  const showPoolData = hasStarted || isAdmin;

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
                    <Route path="/admin" element={<DevTools regularSeasonStats={regularSeasonStats} />} />
                    <Route path="/commissioners-corner" element={<CommissionersCorner season={season} />} />
                    <Route path="/insights" element={showPoolData
                      ? <Insights players={players} regularSeasonStats={regularSeasonStats} season={season} users={activeUsers} unselectedPlayers={unselectedPlayers} />
                      : <PlayoffLocked page='insights' />
                    } />
                    <Route path="/my-team" element={<MyTeam playerDeltas={playerDeltas} rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint} />} />
                    <Route path="/player-details" element={showPoolData
                      ? <PlayerDetails players={players} season={season} users={activeUsers} unselectedPlayers={unselectedPlayers} />
                      : <PlayoffLocked page='player-details' />
                    } />
                    <Route path="/history" element={showPoolData
                      ? (
                        <Suspense fallback={<Loader active inline='centered' size='large'>Loading History...</Loader>}>
                          <History season={season} />
                        </Suspense>
                      )
                      : <PlayoffLocked page='history' />
                    } />
                    <Route path="/standings" element={<Standings liveStatsEnabled={liveStatsEnabled} season={season} users={activeUsers} />} />
                    <Route path="/team-builder" element={<TeamBuilder regularSeasonStats={regularSeasonStats} rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint} />} />
                    <Route path="/team-details" element={showPoolData
                      ? <TeamDetails players={players} season={season} users={activeUsers} />
                      : <PlayoffLocked page='team-details' />
                    } />
                    <Route path="/" element={hasStarted
                      ? (isWide
                        ? <Insights players={players} regularSeasonStats={regularSeasonStats} season={season} users={activeUsers} unselectedPlayers={unselectedPlayers} />
                        : <Standings liveStatsEnabled={liveStatsEnabled} season={season} users={activeUsers} />)
                      : <Navigate replace to='/team-builder' />
                    } />
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
