import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

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

/**
 * Mobile route shell — plain flex column (no Semantic Grid). SUI Grid rows/columns
 * fight the flex height chain, so the scroll region never gets a bounded height and
 * nothing scrolls while overflow:hidden ancestors clip content.
 */

const MobileLayout = ({
  toggleLiveStats,
  liveStatsEnabled,
  season,
  activeUsers,
  players,
  unselectedPlayers,
  regularSeasonStats,
  playerDeltas,
}) => {
  const { hasStarted } = usePlayoffLock();
  const isAdmin = useIsAdmin();
  const showPoolData = hasStarted || isAdmin;

  return (
    <div className='app-mobile-wrapper'>
      <div className='app-mobile-route-scroll app-mobile-page'>
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
            ? <Standings season={season} users={activeUsers} liveStatsEnabled={liveStatsEnabled} />
            : <Navigate replace to='/team-builder' />
          } />
        </Routes>
      </div>

      <Navigation
        liveStatsEnabled={liveStatsEnabled}
        onLiveStatsToggle={toggleLiveStats}
      />
    </div>
  );
};

export default React.memo(MobileLayout);