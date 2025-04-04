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

// import useRosters from '../hooks/useRosters';
import useRegularSeasonStats from '../hooks/useRegularSeasonStats';
import useStandings from '../hooks/useStandings';
import useUsers from '../hooks/useUsers';
import TeamBuilder from './TeamBuilder';
import { Checkbox } from 'semantic-ui-react';
// import PlayerLookup from './PlayerLookup';
// import useUsersNew from '../hooks/useUsersNew';

const currentYear = new Date().getFullYear().toString();

const App = () => {
  const [activeItem, setActiveItem] = useState('');
  const [season, setSeason] = useState(currentYear);
  const [selectedRoster, setSelectedRoster] = useState([]);
  const [beta, setBeta] = useState(true);
  const playoffTeams = useStandings();
  const regularSeasonStats = useRegularSeasonStats(playoffTeams);
  const users = useUsers(season);
  // const rosters = useRosters(playoffTeams)

  return (
    <Fragment>
      <Header
        season={season}
      />
      <Scoreboard />
      <div className='ui stackable grid' style={{ padding: '10px' }}>
        <div className='four wide column'>
          <StandingsList
            users={users}
            onRosterSelect={setSelectedRoster}
            season={season}
          />
        </div>
        <div className='twelve wide column'>
          <Navigation
            onMenuSelect={setActiveItem}
            onSeasonSelect={setSeason}
            beta={beta}
          />
          {/* </div>
        <div className='twelve wide column'> */}
          {activeItem === 'commissioners-corner' ?
            <Announcement
              selectedRoster={selectedRoster[0]}
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
          {beta && activeItem === 'team-builder' ?
            <TeamBuilder
              regularSeasonStats={regularSeasonStats}
            />
            : null}
        </div>
        {/* <div><PlayerLookup onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Player onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Stats playerId={playerId} playerName={playerName}/></div> */}
        {/* <div><Teams /></div> */}
      </div>
      {/* <div style={{ position: 'fixed', bottom: 10, right: 10, zoom: 0.65 }}>
        <Checkbox
          onChange={() => setBeta(!beta)}
          toggle
          label='Beta'
        />
      </div> */}
    </Fragment>
  );
}

export default App;