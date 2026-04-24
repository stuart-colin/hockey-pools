import React, { Fragment, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";

import Alert from "./Alert";
import CountdownTimer from "./CountdownTimer";
import DesktopLayout from "./layouts/DesktopLayout";
import MobileLayout from "./layouts/MobileLayout";
import Scoreboard from "./Scoreboard";
import SplashScreen from "./SplashScreen";

import { useBreakpoint } from "../hooks/useBreakpoint";
import useBoxscores from "../hooks/useBoxscores";
import useLiveStats from "../hooks/useLiveStats";
import usePlayerData from "../hooks/usePlayerData";
import useRegularSeasonStats from "../hooks/useRegularSeasonStats";
import useScores from "../hooks/useScores";
import useStandings from "../hooks/useStandings";
import useUnselectedPlayers from "../hooks/useUnselectedPlayers";
import useUsers from "../hooks/useUsers";

import { DevToolsProvider, useDevTools } from "../context/DevToolsContext";
import { EliminatedTeamsProvider, useEliminatedTeamsContext } from "../context/EliminatedTeamsContext";

import { APP_CONFIG } from "../config/appConfig";
import { POSITION_ARRAYS } from "../constants/positions";
import getSeasonOrdinal from "../utils/getSeasonOrdinal";
import { augmentUnselectedPlayers } from "../utils/parseLiveStats";

const AppContent = ({ season, setSeason }) => {
  // ===== UI State =====
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash screen if it hasn't been shown in this session
    return !sessionStorage.getItem('splashShown');
  });
  const [showAlert, setShowAlert] = useState(true);

  // ===== Feature Toggles =====
  const [liveStatsEnabled, setLiveStatsEnabled] = useState(
    () => localStorage.getItem('liveStatsEnabled') !== 'false'
  );

  // ===== Auth & Breakpoints =====
  const { isMobile, isTablet, isDesktop, isWide } = useBreakpoint();

  // ===== Data Hooks =====
  const { devTools } = useDevTools();
  const { eliminatedTeams, loading: eliminatedLoading } = useEliminatedTeamsContext();
  const playoffTeams = useStandings();
  const regularSeasonStats = useRegularSeasonStats(playoffTeams, season);
  const users = useUsers(season, eliminatedTeams, eliminatedLoading);
  const todayScores = useScores(devTools.testScoresDate, { skip: !liveStatsEnabled });
  const gamesToBoxscore = useMemo(() => liveStatsEnabled ? todayScores.games : [], [liveStatsEnabled, todayScores.games]);
  const { boxscores } = useBoxscores(gamesToBoxscore);

  // Build a stable stub list of selected players (id + name only) directly from
  // the raw rosters so useUnselectedPlayers can run *before* live-stats merging.
  // This breaks the dependency cycle (live stats need to know unselected ids
  // to track their deltas, but unselected fetch needs to know selected ids).
  const selectedPlayerStubs = useMemo(() => {
    if (!users?.rosters) return [];
    const stubs = [];
    for (const roster of users.rosters) {
      for (const pos of POSITION_ARRAYS) {
        if (Array.isArray(roster[pos])) {
          for (const p of roster[pos]) if (p) stubs.push({ id: p.id, name: p.name });
        }
      }
      if (roster.utility) stubs.push({ id: roster.utility.id, name: roster.utility.name });
    }
    return stubs;
  }, [users?.rosters]);

  const { unselectedPlayers: rawUnselectedPlayers } = useUnselectedPlayers(selectedPlayerStubs, season, eliminatedTeams);

  const unselectedPlayerIds = useMemo(() => {
    const ids = new Set();
    for (const p of rawUnselectedPlayers || []) {
      if (p?.id == null) continue;
      const numericId = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
      if (!Number.isNaN(numericId)) ids.add(numericId);
    }
    return ids;
  }, [rawUnselectedPlayers]);

  const { augmentedUsers, playerDeltas } = useLiveStats(todayScores.games, boxscores, users, unselectedPlayerIds);
  const activeUsers = liveStatsEnabled ? augmentedUsers : users;
  const players = usePlayerData(activeUsers);

  const unselectedPlayers = useMemo(() => {
    if (!liveStatsEnabled) return rawUnselectedPlayers;
    return augmentUnselectedPlayers(rawUnselectedPlayers, playerDeltas);
  }, [rawUnselectedPlayers, playerDeltas, liveStatsEnabled]);

  // ===== Helpers =====
  const toggleLiveStats = () => {
    setLiveStatsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('liveStatsEnabled', next);
      return next;
    });
  };

  const alertMessageHeading = `📢 Welcome to BP's ${getSeasonOrdinal(season)} Annual Hockey Pool!`;

  return (
    <>
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            sessionStorage.setItem('splashShown', 'true');
            setShowSplash(false);
          }}
        />
      )}
      <div className={`app-shell app-content ${showSplash ? "hidden-content" : "visible-content"}`}>
        <Fragment>
          <Scoreboard todayScores={todayScores} />
          <div className="app-main-stack">
            {showAlert && (
              <Alert
                messageHeading={alertMessageHeading}
                message={APP_CONFIG.alertMessage}
                onClose={() => setShowAlert(false)}
              />
            )}
            <CountdownTimer />

            <div className="app-page-column">
              <Routes>
                <Route path="/*" element={
                  isMobile || isTablet ? (
                    <MobileLayout
                      toggleLiveStats={toggleLiveStats}
                      liveStatsEnabled={liveStatsEnabled}
                      season={season}
                      activeUsers={activeUsers}
                      players={players}
                      unselectedPlayers={unselectedPlayers}
                      regularSeasonStats={regularSeasonStats}
                      playerDeltas={playerDeltas}
                    />
                  ) : (
                    <DesktopLayout
                      toggleLiveStats={toggleLiveStats}
                      liveStatsEnabled={liveStatsEnabled}
                      season={season}
                      activeUsers={activeUsers}
                      players={players}
                      unselectedPlayers={unselectedPlayers}
                      regularSeasonStats={regularSeasonStats}
                      playerDeltas={playerDeltas}
                      isWide={isWide}
                    />
                  )
                } />
              </Routes>
            </div>
          </div>
        </Fragment>
      </div>
    </>
  );
};

const App = () => {
  const [season, setSeason] = useState(APP_CONFIG.currentYear);

  return (
    <DevToolsProvider>
      <EliminatedTeamsProvider season={season}>
        <AppContent
          season={season}
          setSeason={setSeason}
        />
      </EliminatedTeamsProvider>
    </DevToolsProvider>
  );
};

export default App;