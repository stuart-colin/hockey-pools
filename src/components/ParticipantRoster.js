import React, { useState, useEffect } from 'react';
import useRoster from '../hooks/useRoster';
import StatsCard from './StatsCard';
import StatsSlim from './StatsSlim';
import '../data/TempRosters';

const transitionStyle = {
  transition: 'all 0.5s',
}

const collapsedStyle = {
  ...transitionStyle,
  maxHeight: '0em',
  transition: 'all 0.5s',
  overflow: 'hidden',
  filter: 'opacity(0)',
}

const expandedStyle = {
  ...transitionStyle,
  maxHeight: '60em',
  minHeight: '15em',
  overflowY: 'auto',
  overflowX: 'hidden',
  filter: 'opacity(1)',
}

const ParticipantRoster = ({ selectedRoster, rosterData }) => {
  const [visible, setVisible] = useState('false');

  if (!selectedRoster) {
    return (
      <div className="ui vertical segment">
        <div className="ui top blue centered attached header" onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
          <h2>
            Select a roster...
          </h2>
        </div>
      </div >
    )
  };

  return (
    <div className="ui vertical segment">
      <div className="ui top blue centered attached header" onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
        <div className="ui stackable grid">
          <div className="three column row">
            <div className="left aligned column">
              <h3 style={{ position: 'absolute' }}>
                {visible &&
                  <i className="ui small angle double up icon"></i>
                }
                {!visible &&
                  <i className="ui small angle double down icon"></i>
                }
              </h3>
            </div>
            <div className="middle aligned column">
              <h2>
                {selectedRoster.name}
              </h2>
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
      <div className="ui attached segment" style={!visible ? collapsedStyle : expandedStyle}>
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