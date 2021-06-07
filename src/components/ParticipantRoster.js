import React from 'react';
import StatsNew from '../api/StatsNew';

// const URL = 'http://localhost:5001/_api/rosters';

const testRoster = {
  participant: {
    name: 'Colin Stuart',
    region: 'Rhode Island',
    country: 'USA'
  },
  roster: {
    center: {
      playerId1: '8479318',
      playerId2: '8477492',
      playerId3: '8473563'
    },
    left: {
      playerId1: '8473419',
      playerId2: '8476455',
      playerId3: '8474157'
    },
    right: {
      playerId1: '8478483',
      playerId2: '8478420',
      playerId3: '8475913'
    },
    defense: {
      playerId1: '8475167',
      playerId2: '8474590',
      playerId3: '8480069',
      playerId4: '8477447'
    },
    goalie: {
      playerId1: '8475831',
      playerId2: '8477970'
    },
    utility: {
      playerId1: '8478402'
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
    <div className="ui container">
      <div className="ui header">
        <div>
          <h2>{testRoster.participant.name}</h2>
          <h3>{testRoster.participant.region}, {testRoster.participant.country}</h3>
        </div>
      </div>
      <div className="ui four column stackable grid">
        <div className="content">
          <ul><h4>Left Wing</h4></ul>
          <ul><StatsNew id={testRoster.roster.left.playerId1} /></ul>
          <ul><StatsNew id={testRoster.roster.left.playerId2} /></ul>
          <ul><StatsNew id={testRoster.roster.left.playerId3} /></ul>
        </div>
        <div className="content">
          <ul><h4>Center</h4></ul>
          <ul><StatsNew id={testRoster.roster.center.playerId1} /></ul>
          <ul><StatsNew id={testRoster.roster.center.playerId2} /></ul>
          <ul><StatsNew id={testRoster.roster.center.playerId3} /></ul>
        </div>
        <div className="content">
          <ul><h4>Right Wing</h4></ul>
          <ul><StatsNew id={testRoster.roster.right.playerId1} /></ul>
          <ul><StatsNew id={testRoster.roster.right.playerId2} /></ul>
          <ul><StatsNew id={testRoster.roster.right.playerId3} /></ul>
        </div>
        <div className="content">
          <ul><h4>Defense</h4></ul>
          <ul><StatsNew id={testRoster.roster.defense.playerId1} /></ul>
          <ul><StatsNew id={testRoster.roster.defense.playerId2} /></ul>
          <ul><StatsNew id={testRoster.roster.defense.playerId3} /></ul>
          <ul><StatsNew id={testRoster.roster.defense.playerId4} /></ul>
        </div>
        <div className="content">
          <ul><h4>Goalie</h4></ul>
          <ul><StatsNew id={testRoster.roster.goalie.playerId1} /></ul>
          <ul><StatsNew id={testRoster.roster.goalie.playerId2} /></ul>
        </div>
        <div className="content">
          <ul><h4>Utility</h4></ul>
          <ul><StatsNew id={testRoster.roster.utility.playerId1} /></ul>
        </div>
      </div>
    </div>
  )

}

export default ParticipantRoster;