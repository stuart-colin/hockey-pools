import React from 'react';
// import PlayerLookup from './PlayerLookup';
// import Player from '../api/Player';
// import Teams from '../api/Teams';
// import Stats from '../api/Stats';
import ParticipantRoster from './ParticipantRoster';

// const playerId = '8476453';

const App = () => {
  // const [playerId, setPlayerId] = useState();
//   const [playerName, setPlayerName] = useState();

// const updatePlayerData = ({/*id,*/} name) => {
//     // setPlayerId(id);
//     setPlayerName(name);
//   };

    return (
      <div>
        <div><ParticipantRoster /></div>
        {/* <div><PlayerLookup onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Player onPlayerLookup={updatePlayerData}/></div> */}
        {/* <div><Stats playerId={playerId} playerName={playerName}/></div> */}
        {/* <div><Teams /></div> */}
      </div>
      
    );
}

export default App;