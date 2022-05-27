import React, { useState } from 'react';

import Announcement from './Announcement';
import Header from './Header';
import Insights from './Insights';
import ParticipantRoster from './ParticipantRoster';
// import PlayerLookup from './PlayerLookup';
import Scoreboard from './Scoreboard';
import StandingsList from './StandingsList';

import useUsers from '../hooks/useUsers';

const App = () => {
  const [selectedRoster, setSelectedRoster] = useState([]);
  const users = useUsers();

  return (
    <div>
      <Announcement />
      <div className='ui stackable grid'>
        <div className='twelve wide column'>
          <Header />
          <Scoreboard />
          {/* <Insights /> */}
          <ParticipantRoster
            selectedRoster={selectedRoster[0]}
            rosterData={selectedRoster[1]}
          />
        </div>
        <div className='four wide column'>
          <StandingsList
            users={users}
            onRosterSelect={setSelectedRoster}
          />
        </div>
        {/* <div><PlayerLookup onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Player onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Stats playerId={playerId} playerName={playerName}/></div> */}
        {/* <div><Teams /></div> */}
      </div>
    </div>
  );
}

export default App;