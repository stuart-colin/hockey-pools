import React from 'react';
import '../css/customStyle.css';

const StatsSlim = ({ player }) => {

  let stats;
  if (player.position === 'G') {
    stats = [player.wins, 'W', player.shutouts, 'SO', player.otl, 'OTL'];
  } else {
    stats = [player.goals, 'G', player.assists, 'A', player.otGoals, 'OTG'];
  }

  return (
    <div key={player.name} className={`ui blue card ${player.isEliminated ? 'eliminated' : ''}`} alt={`${player.teamName} logo`}>
      <div className='items' >
        <div className='logoBox'>
          <img className='teamLogoSlim' src={player.teamLogo} alt={`${player.teamName} Logo`} />
        </div>
        <div className='content' style={{ padding: '5px 10px 5px 0px' }} >
          <div className='left floated meta'>
            <img className="ui circular image" src={player.headshot} alt={`${player.name} Headshot`} style={{ width: '55px' }} />
          </div>
          <div className="content">
            <div className='right floated meta'>{player.position}</div>
            <div className="sub header">{player.name}</div>
            <div className="meta">{player.teamName}</div>
            <div className="description">
              <b>{stats[0]}</b> {stats[1]} | <b>{stats[2]}</b> {stats[3]} | <b>{stats[4]}</b> {stats[5]} | <b>{player.points}</b> Pool Points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSlim;