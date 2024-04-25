import React from 'react';
import eliminatedTeams from '../constants/eliminatedTeams';
import '../css/customStyle.css';

const logoUrl = 'https://assets.nhle.com/logos/nhl/svg/';
const photoUrl = 'https://assets.nhle.com/mugs/nhl/20232024/';

const StatsSlim = ({ player }) => {

  switch (player.stats.teamName) {
    case 'Anaheim Ducks':
      var teamAbbrev = 'ANA';
      break;
    case 'Arizona Coyotes':
      var teamAbbrev = 'ARI';
      break;
    case 'Boston Bruins':
      var teamAbbrev = 'BOS';
      break;
    case 'Buffalo Sabres':
      var teamAbbrev = 'BUF';
      break;
    case 'Calgary Flames':
      var teamAbbrev = 'CGY';
      break;
    case 'Carolina Hurricanes':
      var teamAbbrev = 'CAR';
      break;
    case 'Chicago Blackhawks':
      var teamAbbrev = 'CHI';
      break;
    case 'Colorado Avalanche':
      var teamAbbrev = 'COL';
      break;
    case 'Columbus Blue Jackets':
      var teamAbbrev = 'CBJ';
      break;
    case 'Dallas Stars':
      var teamAbbrev = 'DAL';
      break;
    case 'Detroit Red Wings':
      var teamAbbrev = 'DET';
      break;
    case 'Edmonton Oilers':
      var teamAbbrev = 'EDM';
      break;
    case 'Florida Panthers':
      var teamAbbrev = 'FLA';
      break;
    case 'Los Angeles Kings':
      var teamAbbrev = 'LAK';
      break;
    case 'Minnesota Wild':
      var teamAbbrev = 'MIN';
      break;
    case 'Montreal Canadiens':
      var teamAbbrev = 'MTL';
      break;
    case 'Nashville Predators':
      var teamAbbrev = 'NSH';
      break;
    case 'New Jersey Devils':
      var teamAbbrev = 'NJD';
      break;
    case 'New York Islanders':
      var teamAbbrev = 'NYI';
      break;
    case 'New York Rangers':
      var teamAbbrev = 'NYR';
      break;
    case 'Ottawa Senators':
      var teamAbbrev = 'OTT';
      break;
    case 'Philadelphia Flyers':
      var teamAbbrev = 'PHI';
      break;
    case 'Pittsburgh Penguins':
      var teamAbbrev = 'PIT';
      break;
    case 'San Jose Sharks':
      var teamAbbrev = 'SJS';
      break;
    case 'Seattle Kraken':
      var teamAbbrev = 'SEA';
      break;
    case 'St. Louis Blues':
      var teamAbbrev = 'STL';
      break;
    case 'Tampa Bay Lightning':
      var teamAbbrev = 'TBL';
      break;
    case 'Toronto Maple Leafs':
      var teamAbbrev = 'TOR';
      break;
    case 'Vancouver Canucks':
      var teamAbbrev = 'VAN';
      break;
    case 'Vegas Golden Knights':
      var teamAbbrev = 'VGK';
      break;
    case 'Washington Capitals':
      var teamAbbrev = 'WSH';
      break;
    case 'Winnipeg Jets':
      var teamAbbrev = 'WPG';
      break;
  };

  let stats;
  let points;
  if (player.position === 'G') {
    stats = [player.stats.featuredStats.playoffs.subSeason.wins, 'W', player.stats.featuredStats.playoffs.subSeason.shutouts, 'SO', player.stats.featuredStats.playoffs.subSeason.otLosses, 'OTL'];
    points = stats[0] * 2 + stats[2] * 2 + stats[4];
  } else {
    stats = [player.stats.featuredStats.playoffs.subSeason.goals, 'G', player.stats.featuredStats.playoffs.subSeason.assists, 'A', player.stats.featuredStats.playoffs.subSeason.otGoals, 'OTG']
    points = stats[0] + stats[2] + stats[4];
  }

  return (
    <div key={player.name} className={`ui blue card ${eliminatedTeams.includes(player.stats.teamName) ? 'eliminated' : ''}`} alt={`${player.stats.teamName} logo`}>
      <div className='items' >
        <div className='logoBox'>
          <img className='teamLogoSlim' src={logoUrl + teamAbbrev + '_light.svg'} alt={`${player.stats.teamName} Logo`} />
        </div>
        <div className='content' style={{ padding: '5px 10px 5px 0px' }} >
          <div className='left floated meta'>
            <img className="ui circular image" src={photoUrl + teamAbbrev + '/' + player.nhl_id + '.png'} alt={`${player.name} Headshot`} style={{ width: '55px' }} />
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