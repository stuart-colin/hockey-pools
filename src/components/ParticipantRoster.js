import React, { useState } from 'react';
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
  const [pointTotal, setPointTotal] = useState(0);

  const getPlayerTotal = (points) => {
    if (points > 0) {
      setPointTotal(pointTotal + points)
    }
  };

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
        <div className="ui four column stackable grid">
          <div className="four column row">
            <div className="middle aligned column">
              <h2>{testRoster.participant.name}</h2>
              <h3>{testRoster.participant.region}, {testRoster.participant.country}</h3>
            </div>
            <div className="middle aligned column">
            <div className="ui small teal statistic">
                <div className="value">
                  {pointTotal}
                </div>
                <div className="label">
                  Pool Points
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
      <div className="ui four column stackable grid">
        <div className="content">
          <ul key={'left position'}><h4>Left Wing</h4></ul>
          <ul key={'left 1 stats'}><StatsNew id={testRoster.roster.left.playerId1} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'left 2 stats'}><StatsNew id={testRoster.roster.left.playerId2} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'left 3 stats'}><StatsNew id={testRoster.roster.left.playerId3} getPlayerTotal={getPlayerTotal}/></ul>
        </div>
        <div className="content">
          <ul key={'center position'}><h4>Center</h4></ul>
          <ul key={'center 1 stats'}><StatsNew id={testRoster.roster.center.playerId1} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'center 2 stats'}><StatsNew id={testRoster.roster.center.playerId2} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'center 3 stats'}><StatsNew id={testRoster.roster.center.playerId3} getPlayerTotal={getPlayerTotal}/></ul>
        </div>
        <div className="content">
          <ul key={'right position'}><h4>Right Wing</h4></ul>
          <ul key={'right 1 stats'}><StatsNew id={testRoster.roster.right.playerId1} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'right 2 stats'}><StatsNew id={testRoster.roster.right.playerId2} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'right 3 stats'}><StatsNew id={testRoster.roster.right.playerId3} getPlayerTotal={getPlayerTotal}/></ul>
        </div>
        <div className="content">
          <ul key={'defense position'}><h4>Defense</h4></ul>
          <ul key={'defense 1 stats'}><StatsNew id={testRoster.roster.defense.playerId1} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'defense 2 stats'}><StatsNew id={testRoster.roster.defense.playerId2} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'defense 3 stats'}><StatsNew id={testRoster.roster.defense.playerId3} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'defense 4 stats'}><StatsNew id={testRoster.roster.defense.playerId4} getPlayerTotal={getPlayerTotal}/></ul>
        </div>
        <div className="content">
          <ul key={'goalie position'}><h4>Goalie</h4></ul>
          <ul key={'goalie 1 stats'}><StatsNew id={testRoster.roster.goalie.playerId1} getPlayerTotal={getPlayerTotal}/></ul>
          <ul key={'goalie 2 stats'}><StatsNew id={testRoster.roster.goalie.playerId2} getPlayerTotal={getPlayerTotal}/></ul>
        </div>
        <div className="content">
          <ul key={'utility position'}><h4>Utility</h4></ul>
          <ul key={'utility stats'}><StatsNew id={testRoster.roster.utility.playerId1} getPlayerTotal={getPlayerTotal}/></ul>
        </div>
      </div>
    </div>
  )

}

export default ParticipantRoster;