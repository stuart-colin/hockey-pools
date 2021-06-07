import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/people/';

const Player = ({ onPlayerLookup }) => {
  const [playerId, setPlayerId] = useState('');
  const [playerList, setPlayerList] = useState({people: ['']});

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get(URL + playerId);

      setPlayerList(data);
    };

    search();
  }, [playerId]);

  useEffect(() => {
    onPlayerLookup(playerId, playerName);
  }, [playerList, playerId]);

  const playerName = playerList.people[0].fullName;
  const playerPosition = playerList.people[0].primaryPosition[0];

  return ({playerName, playerPosition});
};

export default Player;