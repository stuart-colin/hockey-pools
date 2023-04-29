import React, { Fragment, useState } from 'react';

import Announcement from './Announcement';
import Header from './Header';
import Insights from './Insights';
import Navigation from './Navigation';
import ParticipantRoster from './ParticipantRoster';
import PlayerDetails from './PlayerDetails';
import Scoreboard from './Scoreboard';
import StandingsList from './StandingsList';
import TeamDetails from './TeamDetails';

import useUsers from '../hooks/useUsers';
// import PlayerLookup from './PlayerLookup';
// import useUsersNew from '../hooks/useUsersNew';
// import useRoster from '../hooks/useRoster';


const App = () => {
  const [activeItem, setActiveItem] = useState('');
  const [season, setSeason] = useState('2023');
  const [selectedRoster, setSelectedRoster] = useState([]);
  const users = useUsers(season);
  // const usersNew = useUsersNew();
  // const users = useRoster(usersNew.userList);

  return (
    <Fragment>
      {/* <Seasons
        onSeasonSelect={setSeason}
      /> */}
      {/* <Announcement /> */}
      <Header
        season={season}
      />
      <Scoreboard />
      <div className='ui stackable grid' style={{ padding: '10px' }}>
        <div className='four wide column'>
          <StandingsList
            users={users}
            onRosterSelect={setSelectedRoster}
          />
        </div>
        <div className='twelve wide column'>
          <Navigation
            onMenuSelect={setActiveItem}
            onSeasonSelect={setSeason}
          />
          {/* </div>
        <div className='twelve wide column'> */}
          {activeItem === 'commissioners-corner' ?
            <Announcement
              selectedRoster={selectedRoster[0]}
            />
            : null
          }
          {activeItem === 'insights' ?
            <Insights
              users={users}
            />
            : null
          }
          {activeItem === 'player-details' ?
            <PlayerDetails
              users={users}
            />
            : null
          }
          {activeItem === 'team-details' ?
            <TeamDetails
              users={users}
              season={season}
            />
            : null
          }
          {activeItem === 'roster-view' ?
            <ParticipantRoster
              selectedRoster={selectedRoster[0]}
              rosterData={selectedRoster[1]}
            />
            : null
          }
        </div>
        {/* <div><PlayerLookup onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Player onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Stats playerId={playerId} playerName={playerName}/></div> */}
        {/* <div><Teams /></div> */}
      </div>
    </Fragment>
  );
}

export default App;