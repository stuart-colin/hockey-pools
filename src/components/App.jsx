import React, { Fragment, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Alert from "./Alert";
import CommissionersCorner from "./CommissionersCorner";
import CountdownTimer from "./CountdownTimer";
import DevTools from "./DevTools";
import DesktopLayout from "./layouts/DesktopLayout";
import Insights from "./Insights";
import MobileLayout from "./layouts/MobileLayout";
import MyTeam from "./MyTeam";
import PlayerDetails from "./PlayerDetails";
import Scoreboard from "./Scoreboard";
import SplashScreen from "./SplashScreen";
import Standings from "./Standings";
import TeamBuilder from "./TeamBuilder/TeamBuilder";
import TeamDetails from "./TeamDetails";

import { useBreakpoint } from "../hooks/useBreakpoint";
import useBoxscores from "../hooks/useBoxscores";
import useLiveStats from "../hooks/useLiveStats";
import usePlayerData from "../hooks/usePlayerData";
import useRegularSeasonStats from "../hooks/useRegularSeasonStats";
import useScores from "../hooks/useScores";
import useStandings from "../hooks/useStandings";
import useUsers from "../hooks/useUsers";

import { DevToolsProvider, useDevTools } from "../context/DevToolsContext";
import { EliminatedTeamsProvider, useEliminatedTeamsContext } from "../context/EliminatedTeamsContext";

import { APP_CONFIG } from "../config/appConfig";
import getSeasonOrdinal from "../utils/getSeasonOrdinal";

const AppContent = ({ season, setSeason }) => {
  // ===== UI State =====
  const [showSplash, setShowSplash] = useState(true);
  const [activeItem, setActiveItem] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  // ===== Feature Toggles =====
  const [liveStatsEnabled, setLiveStatsEnabled] = useState(
    () => localStorage.getItem('liveStatsEnabled') !== 'false'
  );

  // ===== Auth & Breakpoints =====
  const { isAuthenticated } = useAuth0();
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
  const { augmentedUsers, playerDeltas } = useLiveStats(todayScores.games, boxscores, users);
  const activeUsers = liveStatsEnabled ? augmentedUsers : users;
  const players = usePlayerData(activeUsers);

  // ===== Helpers =====
  const toggleLiveStats = () => {
    setLiveStatsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('liveStatsEnabled', next);
      return next;
    });
  };

  const alertMessageHeading = `📢 Welcome to BP's ${getSeasonOrdinal(season)} Annual Hockey Pool!`;

  // ===== Content Mapping =====
  const contentMap = {
    "commissioners-corner": (
      <CommissionersCorner season={season} />
    ),
    "standings": (
      <Standings
        liveStatsEnabled={liveStatsEnabled}
        season={season}
        users={activeUsers}
      />
    ),
    "my-team": (
      <MyTeam
        playerDeltas={playerDeltas}
        rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint}
      />
    ),
    "insights": (
      <Insights
        players={players}
        regularSeasonStats={regularSeasonStats}
        season={season}
        users={activeUsers}
      />
    ),
    "player-details": (
      <PlayerDetails
        players={players}
        season={season}
        users={activeUsers}
      />
    ),
    "team-details": (
      <TeamDetails
        players={players}
        season={season}
        users={activeUsers}
      />
    ),
    "team-builder": (
      <TeamBuilder
        regularSeasonStats={regularSeasonStats}
        rosterDataEndpoint={APP_CONFIG.rosterDataEndpoint}
      />
    ),
    "admin": (
      <DevTools regularSeasonStats={regularSeasonStats} />
    ),
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
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
              {(isMobile || isTablet) ? (
                <MobileLayout
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  contentMap={contentMap}
                  toggleLiveStats={toggleLiveStats}
                  liveStatsEnabled={liveStatsEnabled}
                />
              ) : (
                <DesktopLayout
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  contentMap={contentMap}
                  toggleLiveStats={toggleLiveStats}
                  liveStatsEnabled={liveStatsEnabled}
                  season={season}
                  activeUsers={activeUsers}
                  isWide={isWide}
                />
              )}
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