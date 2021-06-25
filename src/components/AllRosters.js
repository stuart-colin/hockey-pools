import React, { useState, useEffect } from 'react';
import ParticipantRoster from './ParticipantRoster';

const AllRosters = ({ rosters, getRosterPoints }) => {
  const [rosterTotal, setRosterTotal] = useState([]);

  const getRosterTotal = (info) => {
      setRosterTotal(info)
  };

  useEffect(() => {
    getRosterPoints(rosterTotal);
  }, []);

  // console.log(rosterTotal)

  const renderedList = rosters.map((roster) => {
    return (
      <ParticipantRoster selectedRoster={roster} onRosterChange={getRosterTotal} />
      
    )
  });

  return [renderedList];
};

export default AllRosters;