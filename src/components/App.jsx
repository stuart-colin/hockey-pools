import React, { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Grid } from "semantic-ui-react";

import Alert from "./Alert";
import CommissionersCorner from "./CommissionersCorner";
import CountdownTimer from "./CountdownTimer";
import Header from "./Header";
import Insights from "./Insights";
import Navigation from "./Navigation";
import ParticipantRoster from "./ParticipantRoster";
import PlayerCreator from "./PlayerCreator";
import PlayerDetails from "./PlayerDetails";
import Scoreboard from "./Scoreboard";
import SplashScreen from "./SplashScreen";
import StandingsList from "./StandingsList";
import TeamBuilder from "./TeamBuilder/TeamBuilder";
import TeamDetails from "./TeamDetails";

import usePlayerData from "../hooks/usePlayerData";
import useRegularSeasonStats from "../hooks/useRegularSeasonStats";
import useStandings from "../hooks/useStandings";
import useUsers from "../hooks/useUsers";
import useIsMobile from "../hooks/useIsMobile";
import { EliminatedTeamsProvider, useEliminatedTeamsContext } from "../context/EliminatedTeamsContext";
import getSeasonOrdinal from "../utils/getSeasonOrdinal";

const currentYear = new Date().getFullYear().toString();
const alertMessage =
  "We are excited to have you join us this year! Roster submissions will open once all playoff spots have been clinched and will close at the start of the first playoff game.";
// "Reminder: Standings in the app are refreshed roughly every hour, and depend on the NHL updating their data - expect a delay after a game ends to see changes in the standings. Goalie overtime losses are manually added since the NHL does not tally those in the playoffs, so you may see those tracked as soon as immediately after the game ends or later depending on when I am able to get to a computer. Please let us know if you see any discrepancies!";
const rosterDataEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/rosters/`

const AppContent = ({ season, setSeason }) => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [activeItem, setActiveItem] = useState("");
  const [beta, setBeta] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const alertMessageHeading = `📢 Welcome to BP's ${getSeasonOrdinal(season)} Annual Hockey Pool!`;

  const { eliminatedTeams, loading: eliminatedLoading } = useEliminatedTeamsContext();
  const playoffTeams = useStandings();
  const regularSeasonStats = useRegularSeasonStats(playoffTeams, season);
  const users = useUsers(season, eliminatedTeams, eliminatedLoading);
  const players = usePlayerData(users);
  const isMobile = useIsMobile();

  // Map activeItem to components
  const renderContent = () => {
    const components = {
      "commissioners-corner": <CommissionersCorner
        season={season} />,
      "standings": <StandingsList
        users={users}
        season={season}
      />,
      "my-team":
        <ParticipantRoster
          rosterDataEndpoint={rosterDataEndpoint}
        />
      ,
      "insights": <Insights
        users={users}
        players={players}
        season={season}
        regularSeasonStats={regularSeasonStats} />,
      "player-details": <PlayerDetails
        users={users}
        players={players}
        season={season}
      />,
      "team-details": <TeamDetails
        users={users}
        players={players}
        season={season} />,
      "team-builder": <TeamBuilder
        regularSeasonStats={regularSeasonStats}
        rosterDataEndpoint={rosterDataEndpoint}
      />,
    };

    return components[activeItem] || null;
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={`app-content ${showSplash ? "hidden-content" : "visible-content"}`}>
        <Fragment>
          <Scoreboard />
          <div
            style={{
              paddingTop: "55px",
            }}>
            {!isMobile && <Header season={season} />}
            {showAlert && (
              <Alert
                messageHeading={alertMessageHeading}
                message={alertMessage}
                onClose={() => setShowAlert(false)}
              />
            )}
            <CountdownTimer />
            <Grid
              style={{
                ...(isMobile && {
                  position: 'fixed',
                  left: -14,
                  right: -14,
                })
              }} stackable>
              <Grid.Row>
                {!isMobile &&
                  <Grid.Column width={4}>
                    <StandingsList
                      users={users}
                      season={season}
                    />
                  </Grid.Column>
                }
                <Grid.Column width={12}>
                  {!isMobile &&
                    <Navigation
                      onMenuSelect={setActiveItem}
                      onSeasonSelect={setSeason}
                      beta={beta}
                    />
                  }
                  {renderContent()}
                  {isAuthenticated && user.email === "stuart.colin@gmail.com" && (
                    <PlayerCreator regularSeasonStats={regularSeasonStats} />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Fragment >
        {isMobile &&
          <Navigation
            onMenuSelect={setActiveItem}
            onSeasonSelect={setSeason}
            beta={beta}
          />
        }
      </div >
    </>
  );
};

const App = () => {
  const [season, setSeason] = useState(currentYear);

  return (
    <EliminatedTeamsProvider season={season}>
      <AppContent
        season={season}
        setSeason={setSeason}
      />
    </EliminatedTeamsProvider>
  );
};

export default App;