import React from 'react';
import StatsCard from './StatsCard';
// import useStats from '../hooks/useStats';
import '../data/TempRosters';

// const URL = 'http://localhost:5001/_api/rosters';

const ParticipantRoster = ({ selectedRoster, rosterPoints }) => {

    if (!selectedRoster) {
      return (
        <div>Select a roster...</div>
      )
    };

    return (
      
      <div className="ui vertical segment">
        <div className="ui top attached header">
          <div className="ui stackable grid">
            <div className="two column row">
              <div className="middle aligned column">
                <h3>{selectedRoster.name}</h3>
                <i className={`${selectedRoster.country.toLowerCase()} flag`} />{selectedRoster.region}
              </div>
              <div className="middle aligned column">
              <div className="ui right floated small blue statistic">
                  <div className="value">
                    {rosterPoints}
                  </div>
                  <div className="label">
                    Pool Points
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
        <div className="ui attached vertical segment">
          <div className="ui stackable grid">
            {/* <div key={'left position'}><h4>Left Wing</h4></div> */}
            <div className="row"> 
              <ul key={'left 1 stats'}><StatsCard id={selectedRoster.season.roster.left.playerId1} /></ul>
              <ul key={'left 2 stats'}><StatsCard id={selectedRoster.season.roster.left.playerId2} /></ul>
              <ul key={'left 3 stats'}><StatsCard id={selectedRoster.season.roster.left.playerId3} /></ul>
            </div>
            {/* <div key={'center position'}><h4>Center</h4></div> */}
            <div className="row">
              <ul key={'center 1 stats'}><StatsCard id={selectedRoster.season.roster.center.playerId1} /></ul>
              <ul key={'center 2 stats'}><StatsCard id={selectedRoster.season.roster.center.playerId2} /></ul>
              <ul key={'center 3 stats'}><StatsCard id={selectedRoster.season.roster.center.playerId3} /></ul>
            </div>
            {/* <div key={'right position'}><h4>Right Wing</h4></div> */}
            <div className="row">          
              <ul key={'right 1 stats'}><StatsCard id={selectedRoster.season.roster.right.playerId1} /></ul>
              <ul key={'right 2 stats'}><StatsCard id={selectedRoster.season.roster.right.playerId2} /></ul>
              <ul key={'right 3 stats'}><StatsCard id={selectedRoster.season.roster.right.playerId3} /></ul>
            </div>
            {/* <div key={'defense position'}><h4>Defense</h4></div> */}
            <div className="row">          
              <ul key={'defense 1 stats'}><StatsCard id={selectedRoster.season.roster.defense.playerId1} /></ul>
              <ul key={'defense 2 stats'}><StatsCard id={selectedRoster.season.roster.defense.playerId2} /></ul>
              <ul key={'defense 3 stats'}><StatsCard id={selectedRoster.season.roster.defense.playerId3} /></ul>
              <ul key={'defense 4 stats'}><StatsCard id={selectedRoster.season.roster.defense.playerId4} /></ul>
            </div>
            {/* <div key={'goalie position'}><h4>Goalie</h4></div> */}
            <div className="row">          
              <ul key={'goalie 1 stats'}><StatsCard id={selectedRoster.season.roster.goalie.playerId1} /></ul>
              <ul key={'goalie 2 stats'}><StatsCard id={selectedRoster.season.roster.goalie.playerId2} /></ul>
              <ul key={'utility stats'}><StatsCard id={selectedRoster.season.roster.utility.playerId1} /></ul>
            </div>
            {/* <div key={'utility position'}><h4>Utility</h4></div>
            <div className="row">          
              
            </div> */}
          </div>
        </div>
      </div>
    )
}

export default ParticipantRoster;