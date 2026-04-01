import React from 'react';
import '../css/customStyle.css';

const StatsSlim = ({ player }) => {

  const delta = player._delta;

  const deltaStyle = {
    color: '#21ba45',
    fontWeight: 'bold',
    fontSize: '0.85em',
    marginLeft: '2px',
  };

  const renderDelta = (value) => {
    if (!value || value <= 0) return null;
    return <span style={deltaStyle}>+{value}</span>;
  };

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
              {player.position === 'G' ? (
                <><b>{stats[0]}{renderDelta(delta?.wins)}</b> {stats[1]} | <b>{stats[2]}{renderDelta(delta?.shutouts)}</b> {stats[3]} | <b>{stats[4]}{renderDelta(delta?.otl)}</b> {stats[5]} | <b>{player.points}{renderDelta(delta?.points)}</b> Pool Points</>
              ) : (
                <><b>{stats[0]}{renderDelta(delta?.goals)}</b> {stats[1]} | <b>{stats[2]}{renderDelta(delta?.assists)}</b> {stats[3]} | <b>{stats[4]}{renderDelta(delta?.otGoals)}</b> {stats[5]} | <b>{player.points}{renderDelta(delta?.points)}</b> Pool Points</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSlim;