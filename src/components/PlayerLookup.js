import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/people/';

const PlayerLookup = ({ onPlayerLookup }) => {
  const [playerId, setPlayerId] = useState('8476453');
  const [debouncedTerm, setDebouncedTerm] = useState(playerId);
  const [playerList, setPlayerList] = useState({people: ['']});

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(playerId);
      
    }, 0)

    return () => {
      clearTimeout(timerId);
    };
  }, [playerId]);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get(URL + playerId);

      setPlayerList(data);
    };
    
    if (debouncedTerm) {
      search();
    };

  }, [debouncedTerm, playerId]);

  useEffect(() => {
    onPlayerLookup(playerId, playerName);
  }, [playerList, playerId]);

  const playerName = playerList.people[0].fullName;


  

  // const renderedResults = playerList.people.map((player) => {
  //   return (
  //     <div key={player.pageid} className="item">
  //       <div className="content">
  //         <div className="header">{player.fullName}</div>
  //       </div>
  //     </div>
  //   );
  // });

  return (
  <div>
    <div className="ui form">
      <div className="field">
        <label>Enter Player ID</label>
        <input 
          value={playerId}
          onChange={e => setPlayerId(e.target.value)}
          className="input" />
      </div>
    </div>
    <div className="ui celled list">
      
    </div>
  </div>);
};

export default PlayerLookup;