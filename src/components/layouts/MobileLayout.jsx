import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
  regularSeasonStats,
  playerDeltas,
}) => {
  return (
    <div className='app-mobile-wrapper'>
      <div className='app-mobile-route-scroll app-mobile-page'>
        <Routes>
          <Route path="/admin" element={<DevTools />} />
          <Route path="/commissioners-corner" element={<CommissionersCorner season={season} />} />
          <Route path="/insights" element={<Insights players={players} regularSeasonStats={regularSeasonStats} season={season} users={activeUsers} />} />
          <Route path="/my-team" element={<MyTeam playerDeltas={playerDeltas} rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint} />} />
          <Route path="/player-details" element={<PlayerDetails players={players} season={season} users={activeUsers} />} />
          <Route path="/standings" element={<Standings liveStatsEnabled={liveStatsEnabled} season={season} users={activeUsers} />} />
          <Route path="/team-builder" element={<TeamBuilder regularSeasonStats={regularSeasonStats} rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint} />} />
          <Route path="/team-details" element={<TeamDetails players={players} season={season} users={activeUsers} />} />
          <Route path="/" element={<Standings season={season} users={activeUsers} liveStatsEnabled={liveStatsEnabled} />} />
        </Routes>
      </div>

      <Navigation
        liveStatsEnabled={liveStatsEnabled}
        onLiveStatsToggle={toggleLiveStats}
      />
    </div>
  );
};

export default MobileLayout;