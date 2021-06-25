import { useState, useEffect } from 'react';

const playerDetailsEndpoint = 'https://statsapi.web.nhl.com/api/v1/people/';
const playoffStatsEndpoint = '/stats?stats=statsSingleSeasonPlayoffs';
const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';
const photoUrl = 'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/';
const out = [
  'Boston Bruins',
  'Carolina Hurricanes',
  'Colorado Avalanche',
  'Edmonton Oilers',
  'Florida Panthers',
  'Minnesota Wild',
  'Nashville Predators',
  'Pittsburgh Penguins',
  'St. Louis Blues',
  'Toronto Maple Leafs',
  'Vegas Golden Knights',
  'Washington Capitals',
  'Winnipeg Jets'
];

const useStats = ( id ) => {
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerTeam, setPlayerTeam] = useState('');
  const [playerTeamLogo, setPlayerTeamLogo] = useState ('');
  const [statList, setStatList] = useState('');

  useEffect(() => {
    const getPlayerData = async () => {
      const res1 = await fetch(playerDetailsEndpoint + id);
      const json1 = await res1.json();
      const res2 = await fetch(playerDetailsEndpoint + id + playoffStatsEndpoint);
      const json2 = await res2.json();
      setPlayerName(json1.people[0].fullName);
      setPlayerPosition(json1.people[0].primaryPosition.abbreviation);
      setPlayerTeam(json1.people[0].currentTeam.name)
      setPlayerTeamLogo(logoUrl + json1.people[0].currentTeam.id + '.svg')
      setStatList(json2.stats[0].splits[0].stat);
    };
    getPlayerData();
  }, [id]);

  const playerStats = () => {
    if (playerPosition === 'G') {
      const W = statList.wins;
      const WLabel = 'Wins';
      const S = statList.shutouts;
      const SLabel = 'Shutouts';
      const OTL = statList.ot;
      const OTLLabel = 'OT Losses';
      const totalPoolPoints = W*2 + S*2 + OTL;
      return [W, WLabel, S, SLabel, OTL, OTLLabel, totalPoolPoints];
    } else {
      const G = statList.goals;
      const GLabel = 'Goals';
      const A = statList.assists;
      const ALabel = 'Assists';
      const OTG = statList.overTimeGoals;
      const OTGLabel = 'OT Goals';
      const totalPoolPoints = G + A + OTG;
      return [G, GLabel, A, ALabel, OTG, OTGLabel, totalPoolPoints];
    };
  };

  return {
    name: playerName,
    position: playerPosition,
    photo: photoUrl + id + '.png',
    team: playerTeam,
    logo: playerTeamLogo,
    stats: playerStats(),
    eliminated: out
  }
}

export default useStats;