import React from 'react';
import eliminatedTeams from '../constants/eliminatedTeams';
import '../css/customStyle.css';

const StatsSlim = ({ player }) => {

  let stats;
  let points;
  if (player.position === 'G') {
    stats = [player.stats.featuredStats.playoffs.subSeason.wins, 'W', player.stats.featuredStats.playoffs.subSeason.shutouts, 'SO', player.stats.otl, 'OTL'];
    points = stats[0] * 2 + stats[2] * 2 + stats[4];
  } else {
    stats = [player.stats.featuredStats.playoffs.subSeason.goals, 'G', player.stats.featuredStats.playoffs.subSeason.assists, 'A', player.stats.featuredStats.playoffs.subSeason.otGoals, 'OTG']
    points = stats[0] + stats[2] + stats[4];
  }

  return (
    <div key={player.name} className={`ui blue card ${eliminatedTeams.includes(player.stats.teamName) ? 'eliminated' : ''}`} alt={`${player.stats.teamName} logo`}>
      <div className='items' >
        <div className='logoBox'>
          <img className='teamLogoSlim' src={player.stats.teamLogo} alt={`${player.stats.teamName} Logo`} />
        </div>
        <div className='content' style={{ padding: '5px 10px 5px 0px' }} >
          <div className='left floated meta'>
            <img className="ui circular image" src={player.headshot} alt={`${player.name} Headshot`} style={{ width: '55px' }} />
          </div>
          <div className="content">
            <div className='right floated meta'>{player.position}</div>
            <div className="sub header">{player.name}</div>
            <div className="meta">{player.stats.teamName}</div>
            <div className="description">
              <b>{stats[0]}</b> {stats[1]} | <b>{stats[2]}</b> {stats[3]} | <b>{stats[4]}</b> {stats[5]} | <b>{points}</b> Pool Points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSlim;