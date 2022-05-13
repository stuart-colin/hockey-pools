import { useState, useEffect } from 'react';

const playerDetailsEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/players/';
const playerDetailsEndpointOld = 'https://statsapi.web.nhl.com/api/v1/people/';
// const playoffStatsEndpoint = '/stats?stats=statsSingleSeasonPlayoffs'; // use for current year only
const playoffStatsEndpoint = '/stats?stats=statsSingleSeasonPlayoffs&season=20212022';
const logoUrl = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/';
const photoUrl = 'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/';
const eliminated = [
  'Anaheim Ducks',
  'Arizona Coyotes',
  'Buffalo Sabres',
  'Chicago Blackhawks',
  'Columbus Blue Jackets',
  'Detroit Red Wings',
  'Minnesota Wild',
  'Montreal Canadiens',
  'Nashville Predators',
  'New Jersey Devils',
  'New York Islanders',
  'Ottawa Senators',
  'Philadelphia Flyers',
  'San Jose Sharks',
  'Seattle Kraken',
  'Vancouver Canucks',
  'Vegas Golden Knights',
  'Winnipeg Jets'
];

const useStats = (playerId) => {
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerTeam, setPlayerTeam] = useState('');
  const [playerTeamLogo, setPlayerTeamLogo] = useState('');
  const [statList, setStatList] = useState('');

  useEffect(() => {
    const getPlayerData = async () => {
      // const res1 = await fetch(playerDetailsEndpoint + id);
      // const player = await res1.json();
      const res2 = await fetch(playerDetailsEndpointOld + playerId.nhl_id);
      const player2 = await res2.json();
      const player = player2.people[0];
      setPlayerName(playerId.name);
      setPlayerPosition(playerId.position);
      setPlayerTeam((player.active ? player.currentTeam.name : ''));
      setPlayerTeamLogo((player.active ? logoUrl + player.currentTeam.id + '.svg' : ''));
      // player.stats[0].splits[0].stat = undefined ?
      //   setStatList(null) :
      //   setStatList(player2.stats[0].splits[0].stat);
      setStatList(playerId.stats)
    };
    getPlayerData();
  }, [playerId.nhl_id]);

  const playerStats = () => {
    if (playerPosition === 'G') {
      const W = statList.wins;
      const WLabel = 'Wins';
      const S = statList.shutouts;
      const SLabel = 'Shutouts';
      const OTL = statList.ot;
      const OTLLabel = 'OT Losses';
      const totalPoolPoints = W * 2 + S * 2 + OTL;
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
    photo: photoUrl + playerId.nhl_id + '.png',
    team: playerTeam,
    logo: playerTeamLogo,
    stats: playerStats(),
    eliminated: eliminated,
  }
}

export default useStats;