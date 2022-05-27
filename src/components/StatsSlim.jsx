import React from 'react';
import usePlayer from '../hooks/usePlayer';
import '../css/customStyle.css';

const StatsSlim = ({ id }) => {
  const player = usePlayer(id)

  return (
    <div key={id} className={`ui blue card ${player.eliminated.includes(player.team) ? 'eliminated' : ''}`} alt={`${player.team} logo`}>
      <div className='items' >
        <div className='logoBox'>
          <img className='teamLogoSlim' src={player.logo} alt={`${player.team} Logo`} />
        </div>
        <div className='content' style={{ padding: '5px 10px 5px 0px' }} >
          <div className='left floated meta'>
            <img className="ui circular image" src={player.photo} alt={`${player.name} Headshot`} style={{ width: '55px' }} />
          </div>
          <div className="content">
            <div className='right floated meta'>{player.position}</div>
            <div className="sub header">{player.name}</div>
            <div className="meta">{player.team}</div>
            <div className="description">
              <b>{player.stats[0]}</b> {player.stats[1][0]} | <b>{player.stats[2]}</b> {player.stats[3][0]} | <b>{player.stats[4]}</b> {player.stats[5].split(' ')[0]} | <b>{player.stats[6].toString()}</b> Pool Points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSlim;