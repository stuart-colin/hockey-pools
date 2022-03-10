import React from 'react';
import usePlayer from '../hooks/usePlayer';
import '../css/customStyle.css';

const StatsCard = ({ id }) => {
  const player = usePlayer(id)

  return (
    <div key={id} className={`ui blue card ${!player.eliminated.includes(player.team) ? 'eliminated' : ''}`} alt={`${player.team} logo`}>
      <div className='logoBox'>
        <img className='teamLogo' src={player.logo} alt={`${player.team} Logo`} />
      </div>
      <div className="content">
        <div className="left floated meta">
          <img className="ui tiny circular image" src={player.photo} alt={`${player.name} Headshot`} />
        </div>
        <div className="right floated meta">{player.position}</div>
        <div className="sub header">{player.name}</div>
        {player.team}
      </div>
      <div className="content">
        <div className="ui two column relaxed stackable grid">
          <div className="middle aligned column">
            <div className="ui divided items">
              <div className="item">
                <div className="middle aligned content">
                  <b>{player.stats[0]}</b> {player.stats[1]}
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <b>{player.stats[2]}</b> {player.stats[3]}
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <b>{player.stats[4]}</b> {player.stats[5]}
                </div>
              </div>
            </div>
          </div>
          <div className="middle aligned column">
            <div className="ui small blue statistic">
              <div className="value">
                {player.stats[6].toString()}
              </div>
              <div className="label">
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