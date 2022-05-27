import eliminatedTeams from '../constants/eliminatedTeams';

function eliminatedPlayers(roster) {
  const teams = [
    roster.utility.stats.team.name,
    roster.left[0].stats.team.name,
    roster.left[1].stats.team.name,
    roster.left[2].stats.team.name,
    roster.center[0].stats.team.name,
    roster.center[1].stats.team.name,
    roster.center[2].stats.team.name,
    roster.right[0].stats.team.name,
    roster.right[1].stats.team.name,
    roster.right[2].stats.team.name,
    roster.defense[0].stats.team.name,
    roster.defense[1].stats.team.name,
    roster.defense[2].stats.team.name,
    roster.defense[3].stats.team.name,
    roster.goalie[0].stats.team.name,
    roster.goalie[1].stats.team.name,
  ];

  let playersRemaining = 16;

  teams.map((team) => {
    if (eliminatedTeams.includes(team)) {
      playersRemaining--;
    }
  })

  return playersRemaining;
}

export default eliminatedPlayers;