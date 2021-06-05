import React, { useState, useEffect } from 'react';
import PlayerLookup from './PlayerLookup';
import Teams from '../api/Teams';
import Stats from '../api/Stats';
import ParticipantRoster from './ParticipantRoster';

// const playerId = '8476453';

const App = () => {

    return (
      <div>
        {/* <div><ParticipantRoster playerId={playerId}/></div> */}
        <div><PlayerLookup /></div>
        {/* <div><Stats playerId={playerId}/></div> */}
        {/* <div><Teams /></div> */}
      </div>
      
    );
}

export default App;