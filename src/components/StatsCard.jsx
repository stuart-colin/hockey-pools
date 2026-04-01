import React from 'react';
import '../css/customStyle.css';

const StatsCard = ({ player }) => {

  let stats;
  let points;
  if (player.position === 'G') {
    stats = [player.wins, 'Wins', player.shutouts, 'Shutouts', player.otl, 'OT Losses'];
    points = player.points;
  } else {
    stats = [player.goals, 'Goals', player.assists, 'Assists', player.otGoals, 'OT Goals'];
    points = player.points;
  }

  return (
    <div key={player.name} className={`ui blue card ${player.isEliminated ? 'eliminated' : ''}`} alt={`${player.teamName} logo`}>
      <div className='logoBox'>
        <img className='teamLogo' src={player.teamLogo} alt={`${player.teamName} Logo`} />
      </div>
      <div className='content'>
        <div className='left floated meta'>
          <img className='ui tiny circular image' src={player.headshot} alt={`${player.name} Headshot`} />
        </div>
        <div className='right floated meta'>{player.position}</div>
        <div className='sub header'>{player.name}</div>
        {player.teamName}
      </div>
      <div className='content'>
        <div className='ui two column relaxed stackable grid'>
          <div className='middle aligned column'>
            <div className='ui divided items'>
              <div className='item'>
                <div className='middle aligned content'>
                  <b>{stats[0]}</b> {stats[1]}
                </div>
              </div>
              <div className='item'>
                <div className='middle aligned content'>
                  <b>{stats[2]}</b> {stats[3]}
                </div>
              </div>
              <div className='item'>
                <div className='middle aligned content'>
                  <b>{stats[4]}</b> {stats[5]}
                </div>
              </div>
            </div>
          </div>
          <div className='middle aligned column'>
            <div className='ui small blue statistic'>
              <div className='value'>
                {points}
              </div>
              <div className='label'>
                Pool Points
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;