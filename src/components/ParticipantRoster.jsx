import React, { useState } from 'react';
import StatsCard from './StatsCard';
import StatsSlim from './StatsSlim';
import '../css/customStyle.css';

const ParticipantRoster = ({ selectedRoster, rosterData }) => {
  const [visible, setVisible] = useState('false');
  const [cardView, setCardView] = useState('true');

  if (!selectedRoster) {
    return (
      <div className='ui vertical segments'>
        <div className='ui top blue centered attached header'>
          <div className='ui stackable grid'>
            <div className='three column row'>
              <div className='left aligned column'>
                <h3 style={{ position: 'absolute', cursor: 'pointer' }} onClick={() => setVisible(!visible)}>
                  {visible &&
                    <i className='window minimize outline icon'></i>
                  }
                  {!visible &&
                    <i className='window maximize outline icon'></i>
                  }
                </h3>
              </div>
              <div className='middle aligned column'>
                <h2>
                  Roster Details
                </h2>
              </div>
            </div >
          </div>
        </div>
      </div>
    )
  };

  const rosterPlayers = rosterData[0].map((player, index) => {
    return (
      <ul key={index}>
        {cardView && <StatsSlim player={player} />}
        {!cardView && <StatsCard player={player} />}
      </ul>
    )
  })

  return (
    <div className='ui segments'>
      <div className='ui top blue centered attached header'>
        <div className='ui stackable grid'>
          <div className='three column row'>
            <div className='left aligned column'>
              <h3 style={{ position: 'absolute', cursor: 'pointer' }} onClick={() => setVisible(!visible)}>
                {visible &&
                  <i className='window minimize outline icon'></i>
                }
                {!visible &&
                  <i className='window maximize outline icon'></i>
                }
              </h3>
              <h3 style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setCardView(!cardView)}>
                {cardView &&
                  <i className='id badge outline icon'></i>
                }
                {!cardView &&
                  <i className='id card outline icon'></i>
                }
              </h3>
            </div>
            <div className='middle aligned column'>
              <h2>
                {selectedRoster.owner.name}
              </h2>
              <i className={`${selectedRoster.owner.country.toLowerCase()} flag`} />{selectedRoster.owner.region}
            </div>
            <div className='right aligned column'>
              <div className='ui tiny blue statistic'>
                <div className='value'>
                  {rosterData[1]}
                </div>
                <div className='label'>
                  Pool Points
                </div>
              </div>
              <div className='ui tiny blue statistic'>
                <div className='value'>
                  {rosterData[2]}/16
                </div>
                <div className='label'>
                  Players Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`ui bottom attached segment ${!visible ? 'collapsedStyle' : 'expandedRosterStyle'}`}>
        <div className='ui stackable grid'>
          <div className='row'>
            {rosterPlayers}
          </div>
          {/* <div className='row'>
            <ul key={'left 1 stats'}><StatsCard id={rosterData[2][0]} /></ul>
            <ul key={'left 2 stats'}><StatsCard id={rosterData[2][1]} /></ul>
            <ul key={'left 3 stats'}><StatsCard id={rosterData[2][2]} /></ul>
            </div>
            <div className='row'>
            <ul key={'center 1 stats'}><StatsCard id={rosterData[2][3]} /></ul>
            <ul key={'center 2 stats'}><StatsCard id={rosterData[2][4]} /></ul>
            <ul key={'center 3 stats'}><StatsCard id={rosterData[2][5]} /></ul>
            </div>
            <div className='row'>
            <ul key={'right 1 stats'}><StatsCard id={rosterData[2][6]} /></ul>
            <ul key={'right 2 stats'}><StatsCard id={rosterData[2][7]} /></ul>
            <ul key={'right 3 stats'}><StatsCard id={rosterData[2][8]} /></ul>
            </div>
            <div className='row'>
            <ul key={'defense 1 stats'}><StatsCard id={rosterData[2][9]} /></ul>
            <ul key={'defense 2 stats'}><StatsCard id={rosterData[2][10]} /></ul>
            <ul key={'defense 3 stats'}><StatsCard id={rosterData[2][11]} /></ul>
            <ul key={'defense 4 stats'}><StatsCard id={rosterData[2][12]} /></ul>
            </div>
            <div className='row'>
            <ul key={'goalie 1 stats'}><StatsCard id={rosterData[2][13]} /></ul>
            <ul key={'goalie 2 stats'}><StatsCard id={rosterData[2][14]} /></ul>
            <ul key={'utility stats'}><StatsCard id={rosterData[2][15]} /></ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ParticipantRoster;