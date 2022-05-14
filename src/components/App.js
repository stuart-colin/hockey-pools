import React, { useState } from 'react';
// import PlayerLookup from './PlayerLookup';
// import Player from '../api/Player';
// import Teams from '../api/Teams';
// import Stats from '../api/Stats';
import StandingsList from './StandingsList';
import ParticipantRoster from './ParticipantRoster';
// import AllRosters from './AllRosters';
// import useStats from '../hooks/useStats';
import Announcement from './Announcement';
import Header from './Header';
import Scoreboard from './Scoreboard';

const App = () => {
  // const [rosterData, setRosterPoints] = useState(['']);
  const [selectedRoster, setSelectedRoster] = useState([]);

  return (
    <div>
      <Announcement />
      <div className='ui stackable grid'>
        <div className='twelve wide column'>
          <Header />
          <Scoreboard />
          {/* <AllRosters rosters={rosters} getRosterPoints={getRosterPoints}/> */}
          <ParticipantRoster
            selectedRoster={selectedRoster[0]}
            rosterData={selectedRoster[1]}
          />
        </div>
        <div className='four wide column'>
          <StandingsList
            // rosters={rosters}
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

const testRosters = {
  participant: [
    // {
    //   name: 'Michael Lai',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8470638',
    //         playerId2: '8477492',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8476455',
    //         playerId3: '8477444'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8477956',
    //         playerId3: '8475820'
    //       },
    //       defense: {
    //         playerId1: '8479398',
    //         playerId2: '8480069',
    //         playerId3: '8475197',
    //         playerId4: '8479325'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8471695'
    //       },
    //       utility: {
    //         playerId1: '8477934'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Chris Loh',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8471675',
    //         playerId3: '8477493'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8476456',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8475810',
    //         playerId3: '8471887'
    //       },
    //       defense: {
    //         playerId1: '8471724',
    //         playerId2: '8471735',
    //         playerId3: '8480069',
    //         playerId4: '8477346'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8477465'
    //       },
    //       utility: {
    //         playerId1: '8471215'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Caleb Ijerzman',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8478402',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8480830',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478483',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8476462',
    //         playerId3: '8477447',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8478427'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Kieran Gallivan',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8471675',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8474157',
    //         playerId2: '8476456',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8475810',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8474565',
    //         playerId2: '8477447',
    //         playerId3: '8471724',
    //         playerId4: '8476853'
    //       },
    //       goalie: {
    //         playerId1: '8477465',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8476539'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Andrew Belsheim',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8470638'
    //       },
    //       left: {
    //         playerId1: '8475786',
    //         playerId2: '8473419',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8477956'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8480069',
    //         playerId3: '8475167',
    //         playerId4: '8477447'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8471695'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Brian Park',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478402',
    //         playerId3: '8478010'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477444',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8478483',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8478038',
    //         playerId3: '8479398',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8469608'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Gary Jeffrey',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478427',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8473419',
    //         playerId3: '8476456'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478420',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8475197',
    //         playerId2: '8476462',
    //         playerId3: '8480069',
    //         playerId4: '8479325'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8471695'
    //       },
    //       utility: {
    //         playerId1: '8477934'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Aaron Yeroschak',
    //   region: 'Manitoba',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8471675',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477404',
    //         playerId3: '8471214'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8478420',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8474565',
    //         playerId2: '8480069',
    //         playerId3: '8476853',
    //         playerId4: '8477447'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8477970' // frederick andersen DNP, data returning undefined. rep. w vanecek temporarily
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Aaron Cornborough',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8478402',
    //         playerId3: '8470638'
    //       },
    //       left: {
    //         playerId1: '8475791',
    //         playerId2: '8473419',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8476453',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8479410',
    //         playerId2: '8477447',
    //         playerId3: '8476792',
    //         playerId4: '8475167'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8477970' // frederick andersen DNP, data returning undefined. rep. w vanecek temporarily
    //       },
    //       utility: {
    //         playerId1: '8478010'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Curt Johnston',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8477493',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8476455',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8471887',
    //         playerId2: '8478420',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8477346',
    //         playerId4: '8471735'
    //       },
    //       goalie: {
    //         playerId1: '8475683',
    //         playerId2: '8477970' // devan dubnyk?!?!?! DNP, data returning undefined. rep. w vanecek temporarily
    //       },
    //       utility: {
    //         playerId1: '8469608'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Andrew Krewenki',
    //   region: 'Unknown Wanderer',
    //   country: 'Earth',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8475166'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8474157',
    //         playerId3: '8478398'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8478483',
    //         playerId3: '8477956'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8480069',
    //         playerId3: '8475167',
    //         playerId4: '8476853'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8476453'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Ryan Brooks',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478427',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477444',
    //         playerId3: '8473422'
    //       },
    //       right: {
    //         playerId1: '8480830',
    //         playerId2: '8478483',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8476853',
    //         playerId4: '8476462'
    //       },
    //       goalie: {
    //         playerId1: '8477968',
    //         playerId2: '8475789'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Sandra Jeffrey',
    //   region: 'Unknown Wanderer',
    //   country: 'Earth',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478427',
    //         playerId2: '8479318',
    //         playerId3: '8478010'
    //       },
    //       left: {
    //         playerId1: '8471214',
    //         playerId2: '8476292',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8478483',
    //         playerId3: '8471698'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8476462',
    //         playerId3: '8475167',
    //         playerId4: '8474590'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8473563'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Paul Basek',
    //   region: 'British Columbia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478010',
    //         playerId2: '8477492',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8471214',
    //         playerId2: '8476455',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8478483',
    //         playerId3: '8475810'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8471724',
    //         playerId3: '8480069',
    //         playerId4: '8479398'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8479318'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Gladwin Sun',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478010',
    //         playerId2: '8476905',
    //         playerId3: '8470638'
    //       },
    //       left: {
    //         playerId1: '8476292',
    //         playerId2: '8475791',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8476453',
    //         playerId3: '8477956'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8479410',
    //         playerId3: '8477447',
    //         playerId4: '8479325'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8471695'
    //       },
    //       utility: {
    //         playerId1: '8470594'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Dave Murphy',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8475166',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8475786',
    //         playerId2: '8476455',
    //         playerId3: '8477444'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8477939'
    //       },
    //       defense: {
    //         playerId1: '8479398',
    //         playerId2: '8480069',
    //         playerId3: '8476853',
    //         playerId4: '8474162'
    //       },
    //       goalie: {
    //         playerId1: '8475789',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8479318'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Jason Chen',
    //   region: 'British Columbia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478427',
    //         playerId3: '8476389'
    //       },
    //       left: {
    //         playerId1: '8476882',
    //         playerId2: '8476455',
    //         playerId3: '8478864'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8480830',
    //         playerId3: '8475913'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8478038',
    //         playerId3: '8476462',
    //         playerId4: '8477447'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8477968'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Cameron Scutt',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8474564',
    //         playerId3: '8475166'
    //       },
    //       left: {
    //         playerId1: '8474157',
    //         playerId2: '8473419',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478483',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8479325',
    //         playerId3: '8477447',
    //         playerId4: '8475167'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8471695'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Mike Mcleod',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8477409',
    //         playerId3: '8477935'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8473422',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8475191',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8474565',
    //         playerId2: '8477447',
    //         playerId3: '8476853',
    //         playerId4: '8477346'
    //       },
    //       goalie: {
    //         playerId1: '8475683',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8475789'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Andy Mcleod',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477934',
    //         playerId3: '8471675'
    //       },
    //       left: {
    //         playerId1: '8477444',
    //         playerId2: '8476456',
    //         playerId3: '8477955'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8471887',
    //         playerId3: '8475810'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8477986',
    //         playerId4: '8478507'
    //       },
    //       goalie: {
    //         playerId1: '8475683',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8477465'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Rob Mcleod',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8477404',
    //         playerId2: '8476455',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8477956',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8471724',
    //         playerId3: '8480069',
    //         playerId4: '8475167'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8478483'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Davis Haugen',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8471675',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8471214',
    //         playerId2: '8477404',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8476453',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8480069',
    //         playerId3: '8477447',
    //         playerId4: '8474590'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Brady Logel',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8471675',
    //         playerId3: '8476539'
    //       },
    //       left: {
    //         playerId1: '8476887',
    //         playerId2: '8477404',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8478042',
    //         playerId2: '8475913',
    //         playerId3: '8477949'
    //       },
    //       defense: {
    //         playerId1: '8471724',
    //         playerId2: '8474565',
    //         playerId3: '8477447',
    //         playerId4: '8474600'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8477465'
    //       },
    //       utility: {
    //         playerId1: '8477424'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Brett Long',
    //   region: 'South Africa',
    //   country: 'South Africa',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478427',
    //         playerId2: '8477492',
    //         playerId3: '8476389'
    //       },
    //       left: {
    //         playerId1: '8476882',
    //         playerId2: '8476455',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8480830',
    //         playerId2: '8478420',
    //         playerId3: '8477956'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8477488',
    //         playerId3: '8480069',
    //         playerId4: '8478038'
    //       },
    //       goalie: {
    //         playerId1: '8477968',
    //         playerId2: '8475852'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Jeremy Flynn',
    //   region: 'Newfoundland',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477492',
    //         playerId3: '8471675'
    //       },
    //       left: {
    //         playerId1: '8477404',
    //         playerId2: '8476455',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8477956'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8480069',
    //         playerId3: '8476462',
    //         playerId4: '8471724'
    //       },
    //       goalie: {
    //         playerId1: '8477465',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8479318'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Evan Ward',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8477935',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8477407',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8471887',
    //         playerId2: '8478420',
    //         playerId3: '8475820'
    //       },
    //       defense: {
    //         playerId1: '8477346',
    //         playerId2: '8471735',
    //         playerId3: '8480069',
    //         playerId4: '8478038'
    //       },
    //       goalie: {
    //         playerId1: '8475683',
    //         playerId2: '8476904'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Donnie Harris',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8479318',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8471214',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8471218',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8477346',
    //         playerId2: '8476853',
    //         playerId3: '8480069',
    //         playerId4: '8474590'
    //       },
    //       goalie: {
    //         playerId1: '8475683',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Niclas Como',
    //   region: 'Unknown Wanderer',
    //   country: 'Earth',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478402',
    //         playerId3: '8477934'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8476292',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8475913',
    //         playerId3: '8480830'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8480069',
    //         playerId3: '8475197',
    //         playerId4: '8476462'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8471675'
    //       }
    //     }
    //   }
    // },
    {
      name: 'Alan Shields',
      region: 'North Carolina',
      country: 'United States',
      season: {
        year: '2021',
        score: '0',
        roster: {
          center: {
            playerId1: '8478427',
            playerId2: '8477492',
            playerId3: '8479318'
          },
          left: {
            playerId1: '8476346',
            playerId2: '8476455',
            playerId3: '8479314'
          },
          right: {
            playerId1: '8478420',
            playerId2: '8477939',
            playerId3: '8475726'
          },
          defense: {
            playerId1: '8480069',
            playerId2: '8476853',
            playerId3: '8478038',
            playerId4: '8476958'
          },
          goalie: {
            playerId1: '8475311',
            playerId2: '8475789'
          },
          utility: {
            playerId1: '8475172'
          }
        }
      }
    },
    // {
    //   name: 'Jesse Blais',
    //   region: 'Massachusetts',
    //   country: 'United States',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477493',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8476455',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8477939',
    //         playerId3: '8471887'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8474162',
    //         playerId3: '8477346',
    //         playerId4: '8471735'
    //       },
    //       goalie: {
    //         playerId1: '8475683',
    //         playerId2: '8477970'
    //       },
    //       utility: {
    //         playerId1: '8475166'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Hannah Ector',
    //   region: 'Georgia',
    //   country: 'United States',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8470638',
    //         playerId2: '8471276',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8476455',
    //         playerId3: '8475791'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478420',
    //         playerId3: '8475820'
    //       },
    //       defense: {
    //         playerId1: '8476891',
    //         playerId2: '8479325',
    //         playerId3: '8476422',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8471695',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Reed McDonald',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8477409',
    //         playerId3: '8477493'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8476455',
    //         playerId3: '8477444'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8471887',
    //         playerId3: '8475820'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8475197',
    //         playerId4: '8477346'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476904'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'David Cook',
    //   region: 'British Columbia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8474564'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477444',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8478483',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8475167',
    //         playerId4: '8476853'
    //       },
    //       goalie: {
    //         playerId1: '8475789',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Mike Johnson',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8470638',
    //         playerId2: '8477492',
    //         playerId3: '8478010'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8475791',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478420',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8478038',
    //         playerId3: '8475167',
    //         playerId4: '8476891'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Tyson Armstrong',
    //   region: 'Saskatchewan',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477934',
    //         playerId3: '8478427'
    //       },
    //       left: {
    //         playerId1: '8471214',
    //         playerId2: '8477444',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8480830',
    //         playerId2: '8478420',
    //         playerId3: '8471698'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8476462',
    //         playerId3: '8477498',
    //         playerId4: '8475197'
    //       },
    //       goalie: {
    //         playerId1: '8469608',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8477968'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'George Zarb',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8479318',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8475786',
    //         playerId2: '8473419',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8474565',
    //         playerId3: '8471724',
    //         playerId4: '8478038'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8470638'
    //       }
    //     }
    //   }
    // },
    {
      name: 'Colin Stuart',
      region: 'Rhode Island',
      country: 'United States',
      season: {
        year: '2021',
        score: '0',
        roster: {
          center: {
            playerId1: '8477492',
            playerId2: '8474564',
            playerId3: '8475172',
          },
          left: {
            playerId1: '8476346',
            playerId2: '8478550',
            playerId3: '8479314',
          },
          right: {
            playerId1: '8478420',
            playerId2: '8476453',
            playerId3: '8477501',
          },
          defense: {
            playerId1: '8475167',
            playerId2: '8480069',
            playerId3: '8479323',
            playerId4: '8478038',
          },
          goalie: {
            playerId1: '8475311',
            playerId2: '8476883',
          },
          utility: {
            playerId1: '8474593',
          }
        }
      }
    },
    {
      name: 'Brian Giacoppo',
      region: 'Oregon',
      country: 'United States',
      season: {
        year: '2021',
        score: '0',
        roster: {
          center: {
            playerId1: '8478402',
            playerId2: '8477493',
            playerId3: '8477492'
          },
          left: {
            playerId1: '8476456',
            playerId2: '8476346',
            playerId3: '8479314'
          },
          right: {
            playerId1: '8476453',
            playerId2: '8478483',
            playerId3: '8478420'
          },
          defense: {
            playerId1: '8480069',
            playerId2: '8477932',
            playerId3: '8477950',
            playerId4: '8475167'
          },
          goalie: {
            playerId1: '8475883',
            playerId2: '8474593'
          },
          utility: {
            playerId1: '8475311'
          }
        }
      }
    },
    // {
    //   name: 'Bennet Soderstrom',
    //   region: 'British Columbia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8477492',
    //         playerId3: '8477935'
    //       },
    //       left: {
    //         playerId1: '8477444',
    //         playerId2: '8476455',
    //         playerId3: '8476456'
    //       },
    //       right: {
    //         playerId1: '8471887',
    //         playerId2: '8478483',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8479398',
    //         playerId2: '8480069',
    //         playerId3: '8474590',
    //         playerId4: '8477346'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8475683'
    //       },
    //       utility: {
    //         playerId1: '8477493'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Austin Ward',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478010',
    //         playerId3: '8474564'
    //       },
    //       left: {
    //         playerId1: '8477444',
    //         playerId2: '8476455',
    //         playerId3: '8471214'
    //       },
    //       right: {
    //         playerId1: '8476453',
    //         playerId2: '8478420',
    //         playerId3: '8471698'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8479410',
    //         playerId3: '8480069',
    //         playerId4: '8474590'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Tyler Murray',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8475172',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477444',
    //         playerId3: '8473422'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8478483',
    //         playerId3: '8477939'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8476853',
    //         playerId4: '8474162'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8475789'
    //       },
    //       utility: {
    //         playerId1: '8475166'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Robb Hart',
    //   region: 'Unknown Wanderer',
    //   country: 'Earth',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8470638',
    //         playerId2: '8477492',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8475791',
    //         playerId2: '8476455',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8477956',
    //         playerId3: '8480830'
    //       },
    //       defense: {
    //         playerId1: '8479398',
    //         playerId2: '8480069',
    //         playerId3: '8475197',
    //         playerId4: '8476462'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8471695'
    //       },
    //       utility: {
    //         playerId1: '8477934'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Melissa Bilodeau',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478427',
    //         playerId2: '8478402',
    //         playerId3: '8477934'
    //       },
    //       left: {
    //         playerId1: '8477998',
    //         playerId2: '8476882',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8479344',
    //         playerId2: '8480830',
    //         playerId3: '8475913'
    //       },
    //       defense: {
    //         playerId1: '8475197',
    //         playerId2: '8477498',
    //         playerId3: '8477447',
    //         playerId4: '8476462'
    //       },
    //       goalie: {
    //         playerId1: '8469608',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8476454'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Adam Kapetyn',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8474157',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8478483',
    //         playerId3: '8480830'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8471724',
    //         playerId3: '8480069',
    //         playerId4: '8475167'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8470594'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Alim Rashid',
    //   region: 'Kenya',
    //   country: 'Kenya',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478427',
    //         playerId2: '8479318',
    //         playerId3: '8477492'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477444',
    //         playerId3: '8476882'
    //       },
    //       right: {
    //         playerId1: '8480830',
    //         playerId2: '8478420',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8474590',
    //         playerId3: '8480069',
    //         playerId4: '8479398'
    //       },
    //       goalie: {
    //         playerId1: '8475852',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8476389'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Drew Davis',
    //   region: 'Unknown Wanderer',
    //   country: 'Earth',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8471675'
    //       },
    //       left: {
    //         playerId1: '8476292',
    //         playerId2: '8477404',
    //         playerId3: '8475786'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8475810'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8476853',
    //         playerId3: '8471724',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8477465'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Mitch Hodgson',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8477492',
    //         playerId3: '8474564'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8473419',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8471724',
    //         playerId3: '8475167',
    //         playerId4: '8476853'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8471695'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Jamie Hogge',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8477934',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8473419',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478420',
    //         playerId3: '8471887'
    //       },
    //       defense: {
    //         playerId1: '8475197',
    //         playerId2: '8479325',
    //         playerId3: '8480069',
    //         playerId4: '8475167'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8469608'
    //       },
    //       utility: {
    //         playerId1: '8477493'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Wes Swanson',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8477492',
    //         playerId3: '8471675'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477444',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8476453',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8475167',
    //         playerId3: '8480069',
    //         playerId4: '8471724'
    //       },
    //       goalie: {
    //         playerId1: '8475789',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8476883'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Matt Chisholm',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8477492',
    //         playerId3: '8477493'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8476456',
    //         playerId3: '8478864'
    //       },
    //       right: {
    //         playerId1: '8476453',
    //         playerId2: '8478420',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8477346',
    //         playerId3: '8480069',
    //         playerId4: '8475197'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8473575'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Chapman Sun',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8477492',
    //         playerId3: '8470638'
    //       },
    //       left: {
    //         playerId1: '8476292',
    //         playerId2: '8477444',
    //         playerId3: '8473419'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8478420',
    //         playerId3: '8477956'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8480069',
    //         playerId3: '8479325',
    //         playerId4: '8477447'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8471695'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'James Stuckey',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477492',
    //         playerId3: '8478427'
    //       },
    //       left: {
    //         playerId1: '8476882',
    //         playerId2: '8476455',
    //         playerId3: '8477444'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8480830',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8476462',
    //         playerId4: '8475197'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8476389'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Steve Barker',
    //   region: 'British Columbia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8477493'
    //       },
    //       left: {
    //         playerId1: '8477404',
    //         playerId2: '8476456',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8477939'
    //       },
    //       defense: {
    //         playerId1: '8471724',
    //         playerId2: '8479398',
    //         playerId3: '8480069',
    //         playerId4: '8476853'
    //       },
    //       goalie: {
    //         playerId1: '8477465',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8471675'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Paul Rothfischer',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8474564'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8473419',
    //         playerId3: '8477444'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8477956',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8476853',
    //         playerId3: '8480069',
    //         playerId4: '8479398'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8478402'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Dan Basek',
    //   region: 'British Columbia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477934',
    //         playerId3: '8470638'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8473419',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8477956',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8475197',
    //         playerId3: '8477447',
    //         playerId4: '8475167'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8469608'
    //       },
    //       utility: {
    //         playerId1: '8478010'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Nash Koster',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8471675',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8477404',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8471887',
    //         playerId2: '8475913',
    //         playerId3: '8477949'
    //       },
    //       defense: {
    //         playerId1: '8477346',
    //         playerId2: '8471735',
    //         playerId3: '8477447',
    //         playerId4: '8471724'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8475683'
    //       },
    //       utility: {
    //         playerId1: '8477465'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Zach Denham',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8478427'
    //       },
    //       left: {
    //         playerId1: '8477444',
    //         playerId2: '8476455',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8477939',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479398',
    //         playerId3: '8476462',
    //         playerId4: '8471724'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8475852'
    //       },
    //       utility: {
    //         playerId1: '8471675'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Andrew Overend',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8471675',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8474157',
    //         playerId2: '8477404',
    //         playerId3: '8476456'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8478483',
    //         playerId3: '8475810'
    //       },
    //       defense: {
    //         playerId1: '8476853',
    //         playerId2: '8471724',
    //         playerId3: '8477447',
    //         playerId4: '8477346'
    //       },
    //       goalie: {
    //         playerId1: '8477465',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8475166'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Fraser McIsaac',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478445',
    //         playerId2: '8477492',
    //         playerId3: '8478010'
    //       },
    //       left: {
    //         playerId1: '8478463',
    //         playerId2: '8476455',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8475151',
    //         playerId2: '8478420',
    //         playerId3: '8475913'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8480069',
    //         playerId3: '8475167',
    //         playerId4: '8475181'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8473575'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Kate Bruce',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8475158',
    //         playerId2: '8471675',
    //         playerId3: '8478010'
    //       },
    //       left: {
    //         playerId1: '8475768',
    //         playerId2: '8477404',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8475765',
    //         playerId2: '8478420',
    //         playerId3: '8480830'
    //       },
    //       defense: {
    //         playerId1: '8475167',
    //         playerId2: '8476792',
    //         playerId3: '8471724',
    //         playerId4: '8475753'
    //       },
    //       goalie: {
    //         playerId1: '8476412',
    //         playerId2: '8477465'
    //       },
    //       utility: {
    //         playerId1: '8476883'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Chris Millar',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477493',
    //         playerId2: '8477492',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8478463',
    //         playerId2: '8476456',
    //         playerId3: '8476455'
    //       },
    //       right: {
    //         playerId1: '8475151',
    //         playerId2: '8471887',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8475197',
    //         playerId2: '8480069',
    //         playerId3: '8477346',
    //         playerId4: '8478038'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8475683'
    //       },
    //       utility: {
    //         playerId1: '8478009'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Jay Park',
    //   region: 'Quebec',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8470638',
    //         playerId2: '8477492',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8476455',
    //         playerId3: '8475791'
    //       },
    //       right: {
    //         playerId1: '8477956',
    //         playerId2: '8478420',
    //         playerId3: '8476453'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8479325',
    //         playerId3: '8475167',
    //         playerId4: '8476891'
    //       },
    //       goalie: {
    //         playerId1: '8471695',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Logan Cale',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478402',
    //         playerId2: '8477934',
    //         playerId3: '8478427'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8473419',
    //         playerId3: '8477404'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8475913'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8475197',
    //         playerId3: '8475167',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8470594'
    //       },
    //       utility: {
    //         playerId1: '8477492'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Lindsay Rantala',
    //   region: 'Ontario',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8479318',
    //         playerId2: '8478402',
    //         playerId3: '8477934'
    //       },
    //       left: {
    //         playerId1: '8476456',
    //         playerId2: '8476455',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8478420',
    //         playerId3: '8475913'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8480069',
    //         playerId3: '8475167',
    //         playerId4: '8475197'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8477492'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Tyler Scharnatta',
    //   region: 'Saskatchewan',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8478402',
    //         playerId3: '8471675'
    //       },
    //       left: {
    //         playerId1: '8474157',
    //         playerId2: '8476455',
    //         playerId3: '8476292'
    //       },
    //       right: {
    //         playerId1: '8478483',
    //         playerId2: '8476453',
    //         playerId3: '8478420'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8474565',
    //         playerId3: '8476853',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8479318'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Sam Blais',
    //   region: 'Massachusetts',
    //   country: 'United States',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8476389',
    //         playerId2: '8478427',
    //         playerId3: '8473533'
    //       },
    //       left: {
    //         playerId1: '8476882',
    //         playerId2: '8477931',
    //         playerId3: '8474157'
    //       },
    //       right: {
    //         playerId1: '8480830',
    //         playerId2: '8475799',
    //         playerId3: '8475913'
    //       },
    //       defense: {
    //         playerId1: '8476462',
    //         playerId2: '8476958',
    //         playerId3: '8477447',
    //         playerId4: '8471724'
    //       },
    //       goalie: {
    //         playerId1: '8470594',
    //         playerId2: '8475852'
    //       },
    //       utility: {
    //         playerId1: '8476539'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Mike Lepatsky',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478010',
    //         playerId2: '8478402',
    //         playerId3: '8479318'
    //       },
    //       left: {
    //         playerId1: '8478864',
    //         playerId2: '8475220',
    //         playerId3: '8477942'
    //       },
    //       right: {
    //         playerId1: '8475692',
    //         playerId2: '8476453',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8474716',
    //         playerId2: '8475197',
    //         playerId3: '8475167',
    //         playerId4: '8476853'
    //       },
    //       goalie: {
    //         playerId1: '8475660',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8469608'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Matt Vautour',
    //   region: 'Nova Scotia',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478427',
    //         playerId2: '8477934',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8476292',
    //         playerId3: '8471214'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8475913',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8474590',
    //         playerId3: '8475167',
    //         playerId4: '8476462'
    //       },
    //       goalie: {
    //         playerId1: '8475831',
    //         playerId2: '8476883'
    //       },
    //       utility: {
    //         playerId1: '8471675'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Arnold Whatsworth',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8471675',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8476455',
    //         playerId2: '8477404',
    //         playerId3: '8477998'
    //       },
    //       right: {
    //         playerId1: '8478420',
    //         playerId2: '8480830',
    //         playerId3: '8479344'
    //       },
    //       defense: {
    //         playerId1: '8480069',
    //         playerId2: '8477498',
    //         playerId3: '8471724',
    //         playerId4: '8476462'
    //       },
    //       goalie: {
    //         playerId1: '8469608',
    //         playerId2: '8477465'
    //       },
    //       utility: {
    //         playerId1: '8475831'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Richardt Malan',
    //   region: 'South Africa',
    //   country: 'South Africa',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8477492',
    //         playerId2: '8479318',
    //         playerId3: '8478402'
    //       },
    //       left: {
    //         playerId1: '8473419',
    //         playerId2: '8476455',
    //         playerId3: '8476456'
    //       },
    //       right: {
    //         playerId1: '8475913',
    //         playerId2: '8478420',
    //         playerId3: '8478483'
    //       },
    //       defense: {
    //         playerId1: '8477498',
    //         playerId2: '8475197',
    //         playerId3: '8476853',
    //         playerId4: '8480069'
    //       },
    //       goalie: {
    //         playerId1: '8476883',
    //         playerId2: '8475831'
    //       },
    //       utility: {
    //         playerId1: '8478427'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: 'Matthew Shewchuk',
    //   region: 'Alberta',
    //   country: 'Canada',
    //   season: {
    //     year: '2021',
    //     score: '0',
    //     roster: {
    //       center: {
    //         playerId1: '8478445',
    //         playerId2: '8476539',
    //         playerId3: '8476905'
    //       },
    //       left: {
    //         playerId1: '8478463',
    //         playerId2: '8474157',
    //         playerId3: '8476887'
    //       },
    //       right: {
    //         playerId1: '8475151',
    //         playerId2: '8475913',
    //         playerId3: '8477949'
    //       },
    //       defense: {
    //         playerId1: '8477447',
    //         playerId2: '8474565',
    //         playerId3: '8475181',
    //         playerId4: '8474600'
    //       },
    //       goalie: {
    //         playerId1: '8473575',
    //         playerId2: '8475215'
    //       },
    //       utility: {
    //         playerId1: '8470594'
    //       }
    //     }
    //   }
    // }
  ]
}

// const rosters = testRosters.participant;