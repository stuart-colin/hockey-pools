import React, { Fragment, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMediaQuery } from "react-responsive";
import { Grid, Segment, Container } from "semantic-ui-react";

import Alert from "./Alert";
import Announcement from "./Announcement";
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
import TeamBuilder from "./TeamBuilder";
import TeamDetails from "./TeamDetails";

import useRegularSeasonStats from "../hooks/useRegularSeasonStats";
import useStandings from "../hooks/useStandings";
import useUsers from "../hooks/useUsers";

const currentYear = new Date().getFullYear().toString();
const alertMessageHeading = "📢 Welcome to BP's 20th Annual Hockey Pool!";
const alertMessage =
  "Reminder: Standings in the app are refreshed roughly every hour, and depend on the NHL updating their data - expect a delay after a game ends to see changes in the standings. Goalie overtime losses are manually added since the NHL does not tally those in the playoffs, so you may see those tracked as soon as immediately after the game ends or later depending on when I am able to get to a computer. Please let us know if you see any discrepancies!";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isAuthenticated } = useAuth0();
  const [activeItem, setActiveItem] = useState("");
  const [season, setSeason] = useState(currentYear);
  const [selectedRoster, setSelectedRoster] = useState([]);
  const [beta, setBeta] = useState(true);
  const [showAlert, setShowAlert] = useState(true);

  const playoffTeams = useStandings();
  const regularSeasonStats = useRegularSeasonStats(playoffTeams);
  const users = useUsers(season);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Map activeItem to components
  const renderContent = () => {
    const components = {
      "commissioners-corner": <Announcement />,
      "standings": <StandingsList
        users={users}
        onRosterSelect={setSelectedRoster}
        season={season}
      />,
      "roster-view":
        <ParticipantRoster
          selectedRoster={selectedRoster[0]}
          rosterData={selectedRoster[1]}
        />
      ,
      insights: <Insights users={users} />,
      "player-details": <PlayerDetails users={users} />,
      "team-details": <TeamDetails users={users} season={season} />,
      "team-builder": <TeamBuilder regularSeasonStats={regularSeasonStats} />,
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
              paddingBottom: isMobile ? "55px" : "0px",
              overflowY: "auto",
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
                      onRosterSelect={setSelectedRoster}
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

export default App;