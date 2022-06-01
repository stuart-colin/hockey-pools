import React from 'react';
import eliminatedTeams from '../constants/eliminatedTeams';
import '../css/customStyle.css';

const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';
const photoUrl = 'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/';

const StatsCard = ({ player }) => {

  let stats;
  let points;
  if (player.position === 'G') {
    stats = [player.stats.wins, 'W', player.stats.shutouts, 'SO', player.stats.otl, 'OTL'];
    points = stats[0] * 2 + stats[2] * 2 + stats[4];
  } else {
    stats = [player.stats.goals, 'G', player.stats.assists, 'A', player.stats.overTimeGoals, 'OT']
    points = stats[0] + stats[2] + stats[4];
  }

  return (
    <div key={player.name} className={`ui blue card ${eliminatedTeams.includes(player.team.name) ? 'eliminated' : ''}`} alt={`${player.team.name} logo`}>
      <div className='logoBox'>
        <img className='teamLogo' src={logoUrl + player.team.id + '.svg'} alt={`${player.team.name} Logo`} />
      </div>
      <div className='content'>
        <div className='left floated meta'>
          <img className='ui tiny circular image' src={photoUrl + player.nhl_id + '.png'} alt={`${player.name} Headshot`} />
        </div>
        <div className='right floated meta'>{player.position}</div>
        <div className='sub header'>{player.name}</div>
        {player.team.name}
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