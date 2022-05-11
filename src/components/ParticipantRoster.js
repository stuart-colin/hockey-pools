import React, { useState, useEffect } from 'react';
import useRoster from '../hooks/useRoster';
import StatsCard from './StatsCard';
import StatsSlim from './StatsSlim';
// import useStats from '../hooks/useStats';
import '../data/TempRosters';

// const URL = 'http://localhost:5001/_api/rosters';

const ParticipantRoster = ({ selectedRoster, rosterData }) => {

  if (!selectedRoster) {
    return (
      <div style={{ position: "sticky", top: 20 }}>Select a roster...</div>
    )
  };

  return (
    <div className="ui vertical segment" style={{ position: "sticky", top: 10 }}>
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
                  {rosterData[0]}
                </div>
                <div className="label">
                  Pool Points
                </div>
              </div>
              <div className="ui right floated small blue statistic">
                <div className="value">
                  {rosterData[1]}/16
                </div>
                <div className="label">
                  Players Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ui attached segment" style={{ maxHeight: '62em', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="ui stackable grid">
          <div className="row">
            <ul key={'left 1 stats'}><StatsCard id={rosterData[2][0]} /></ul>
            <ul key={'left 2 stats'}><StatsCard id={rosterData[2][1]} /></ul>
            <ul key={'left 3 stats'}><StatsCard id={rosterData[2][2]} /></ul>
          </div>
          <div className="row">
            <ul key={'center 1 stats'}><StatsCard id={rosterData[2][3]} /></ul>
            <ul key={'center 2 stats'}><StatsCard id={rosterData[2][4]} /></ul>
            <ul key={'center 3 stats'}><StatsCard id={rosterData[2][5]} /></ul>
          </div>
          <div className="row">
            <ul key={'right 1 stats'}><StatsCard id={rosterData[2][6]} /></ul>
            <ul key={'right 2 stats'}><StatsCard id={rosterData[2][7]} /></ul>
            <ul key={'right 3 stats'}><StatsCard id={rosterData[2][8]} /></ul>
          </div>
          <div className="row">
            <ul key={'defense 1 stats'}><StatsCard id={rosterData[2][9]} /></ul>
            <ul key={'defense 2 stats'}><StatsCard id={rosterData[2][10]} /></ul>
            <ul key={'defense 3 stats'}><StatsCard id={rosterData[2][11]} /></ul>
            <ul key={'defense 4 stats'}><StatsCard id={rosterData[2][12]} /></ul>
          </div>
          <div className="row">
            <ul key={'goalie 1 stats'}><StatsCard id={rosterData[2][13]} /></ul>
            <ul key={'goalie 2 stats'}><StatsCard id={rosterData[2][14]} /></ul>
            <ul key={'utility stats'}><StatsCard id={rosterData[2][15]} /></ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantRoster;