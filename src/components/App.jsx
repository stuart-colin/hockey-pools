import React, { useState } from 'react';

import Seasons from './Seasons';
import Announcement from './Announcement';
import Header from './Header';
import Insights from './Insights';
import ParticipantRoster from './ParticipantRoster';
import Scoreboard from './Scoreboard';
import StandingsList from './StandingsList';
import useUsers from '../hooks/useUsers';
// import PlayerLookup from './PlayerLookup';
// import useUsersNew from '../hooks/useUsersNew';
// import useRoster from '../hooks/useRoster';


const App = () => {
  const [season, setSeason] = useState('2023');
  const [selectedRoster, setSelectedRoster] = useState([]);
  const users = useUsers(season);
  // const usersNew = useUsersNew();
  // const users = useRoster(usersNew.userList);

  return (
    <div>
      <Seasons
        onSeasonSelect={setSeason}
      />
      <Announcement />
      <Header
        season={season}
      />
      <Scoreboard />
      <div className='ui stackable grid'>
        <div className='four wide column item'>
          <StandingsList
            users={users}
            onRosterSelect={setSelectedRoster}
          />
        </div>
        <div className='twelve wide column'>
          <ParticipantRoster
            selectedRoster={selectedRoster[0]}
            rosterData={selectedRoster[1]}
          />
          <Insights
            users={users}
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