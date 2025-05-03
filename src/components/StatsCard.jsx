import React from 'react';
import { useEliminatedTeamsContext } from '../context/EliminatedTeamsContext';
import '../css/customStyle.css';

const StatsCard = ({ player }) => {
  const { eliminatedTeams, loading, error } = useEliminatedTeamsContext();

  let stats;
  let points;
  if (player.position === 'G') {
    stats = [player.stats.featuredStats.playoffs.subSeason.wins, 'Wins', player.stats.featuredStats.playoffs.subSeason.shutouts, 'Shutouts', player.stats.otl, 'OT Losses'];
    points = stats[0] * 2 + stats[2] * 2 + stats[4];
  } else {
    stats = [player.stats.featuredStats.playoffs.subSeason.goals, 'Goals', player.stats.featuredStats.playoffs.subSeason.assists, 'Assists', player.stats.featuredStats.playoffs.subSeason.otGoals, 'OT Goals']
    points = stats[0] + stats[2] + stats[4];
  }

  const isEliminated = eliminatedTeams.includes(player.stats.teamName);

  return (
    <div key={player.name} className={`ui blue card ${isEliminated ? 'eliminated' : ''}`} alt={`${player.stats.teamName} logo`}>
      <div className='logoBox'>
        <img className='teamLogo' src={player.stats.teamLogo} alt={`${player.stats.teamName} Logo`} />
      </div>
      <div className='content'>
        <div className='left floated meta'>
          <img className='ui tiny circular image' src={player.headshot} alt={`${player.name} Headshot`} />
        </div>
        <div className='right floated meta'>{player.position}</div>
        <div className='sub header'>{player.name}</div>
        {player.stats.teamName}
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