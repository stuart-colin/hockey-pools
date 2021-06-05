import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stats from '../api/Stats';

const URL = 'https://statsapi.web.nhl.com/api/v1/people/';

const Search = () => {
  const [playerId, setPlayerId] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(playerId);
  const [playerList, setPlayerList] = useState({people: ['']});

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(playerId);
    }, 1000)

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

  }, [debouncedTerm]);

  // useEffect(() => {

  // }, [playerId, playerList.length]);

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
      <Stats playerId={playerId} playerName={playerName}/>
    </div>
  </div>);
};

export default Search;