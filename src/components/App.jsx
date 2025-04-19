import React, { Fragment, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Alert from "./Alert";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Announcement from "./Announcement";
import Header from "./Header";
import Insights from "./Insights";
import Navigation from "./Navigation";
import ParticipantRoster from "./ParticipantRoster";
import PlayerDetails from "./PlayerDetails";
import Scoreboard from "./Scoreboard";
import StandingsList from "./StandingsList";
import TeamDetails from "./TeamDetails";
import PlayerCreator from "./PlayerCreator";
import TeamBuilder from "./TeamBuilder";
import CountdownTimer from "./CountdownTimer";

import useRegularSeasonStats from "../hooks/useRegularSeasonStats";
import useStandings from "../hooks/useStandings";
import useUsers from "../hooks/useUsers";

const currentYear = new Date().getFullYear().toString();

const App = () => {
  const { isLoading, error, user, isAuthenticated } = useAuth0();
  const [activeItem, setActiveItem] = useState("");
  const [season, setSeason] = useState(currentYear);
  const [selectedRoster, setSelectedRoster] = useState([]);
  const [beta, setBeta] = useState(true);
  const [showAlert, setShowAlert] = useState(true);

  const playoffTeams = useStandings();
  const regularSeasonStats = useRegularSeasonStats(playoffTeams);
  const users = useUsers(season);

  // Map activeItem to components
  const renderContent = () => {
    const components = {
      "commissioners-corner": (
        <Announcement selectedRoster={selectedRoster[0]} />
      ),
      "roster-view": (
        <ParticipantRoster
          selectedRoster={selectedRoster[0]}
          rosterData={selectedRoster[1]}
        />
      ),
      "insights": <Insights users={users} />,
      "player-details": <PlayerDetails users={users} />,
      "team-details": <TeamDetails users={users} season={season} />,
      "team-builder": beta && (
        <TeamBuilder regularSeasonStats={regularSeasonStats} />
      ),
    };

    return components[activeItem] || null;
  };

  return (
    <Fragment>
      <div className="fixed-auth-buttons">
        {error && <div>Authentication Error: {error.message}</div>}
        {!error && isLoading && <div>Loading login button...</div>}
        {!error && !isLoading && (
          <Fragment>
            <LoginButton />
            <LogoutButton />
          </Fragment>
        )}
      </div>
      <Scoreboard />
      <Header season={season} />
      {showAlert && (
        <Alert
          messageHeading="📢 Welcome to BP's 20th Annual Hockey Pool!"
          message="You can now register for an account and create your team! You will be able to update your team until puck drop on Saturday."
          onClose={() => setShowAlert(false)}
        />
      )}
      <CountdownTimer />
      <div className="ui stackable grid">
        <div className="four wide column">
          <StandingsList
            users={users}
            onRosterSelect={setSelectedRoster}
            season={season}
          />
        </div>
        <div className="twelve wide column">
          <Navigation
            onMenuSelect={setActiveItem}
            onSeasonSelect={setSeason}
            beta={beta}
          />
          {renderContent()}
          {isAuthenticated && user.email === "stuart.colin@gmail.com" && (
            <PlayerCreator regularSeasonStats={regularSeasonStats} />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default App;
