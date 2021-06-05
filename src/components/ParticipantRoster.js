import React, { useState } from 'react';

// const URL = 'http://localhost:5001/_api/rosters';

const testRoster = {
  participant: {
    name: 'Colin Stuart',
    region: 'Rhode Island',
    country: 'USA'
  },
  roster: {
    left: {
      playerId1: 'left1',
      playerId2: 'left2',
      playerId3: 'left3'
    },
    right: {
      playerId1: '8476453',
      playerId2: 'right2',
      playerId3: 'right3'
    },
    center: {
      playerId1: 'center1',
      playerId2: 'center2',
      playerId3: 'center3'
    },
    defense: {
      playerId1: 'defense1',
      playerId2: 'defense2',
      playerId3: 'defense3',
      playerId4: 'defense4'
    },
    goalie: {
      playerId1: 'goalie1',
      playerId2: 'goalie2'
    },
    utility: {
      playerId1: 'utility1'
    }
  }
}

const ParticipantRoster = () => {
  // const [roster, setRoster] = useState();

  // useEffect(() => {
  //   const getRoster = async () => {
  //     const { data } = await axios.get(URL);
  //     setRoster(data);
  //   }
    
  //   getRoster();
  // }, []);

  return (
    <div>
      <div className="ui header">
        <h1>{testRoster.participant.name}</h1>
        <h2>{testRoster.participant.region}, {testRoster.participant.country}</h2>
      </div>
      <div className="ui card">
        <div className="content">
          <h3>Left Wing</h3>
          <ul>{testRoster.roster.left.playerId1}</ul>
          <ul>{testRoster.roster.left.playerId2}</ul>
          <ul>{testRoster.roster.left.playerId3}</ul>
        </div>
      </div>
      <div className="ui card">
        <div className="content">
          <h3>Right Wing</h3>
          <ul>{testRoster.roster.right.playerId1}</ul>
          <ul>{testRoster.roster.right.playerId2}</ul>
          <ul>{testRoster.roster.right.playerId3}</ul>
        </div>
      </div>
      <div className="ui card">
        <div className="content">
          <h3>Center</h3>
          <ul>{testRoster.roster.center.playerId1}</ul>
          <ul>{testRoster.roster.center.playerId2}</ul>
          <ul>{testRoster.roster.center.playerId3}</ul>
        </div>
      </div>
      <div className="ui card">
        <div className="content">
          <h3>Defense</h3>
          <ul>{testRoster.roster.defense.playerId1}</ul>
          <ul>{testRoster.roster.defense.playerId2}</ul>
          <ul>{testRoster.roster.defense.playerId3}</ul>
          <ul>{testRoster.roster.defense.playerId4}</ul>
        </div>
      </div>
      <div className="ui card">
        <div className="content">
          <h3>Goalie</h3>
          <ul>{testRoster.roster.goalie.playerId1}</ul>
          <ul>{testRoster.roster.goalie.playerId2}</ul>
        </div>
      </div>
      <div className="ui card">
        <div className="content">
          <h3>Utility</h3>
          <ul>{testRoster.roster.utility.playerId1}</ul>
        </div>
      </div>
    </div>
  )

}

export default ParticipantRoster;