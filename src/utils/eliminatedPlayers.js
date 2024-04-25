import eliminatedTeams from '../constants/eliminatedTeams';

function eliminatedPlayers(roster) {
  const teams = [
    roster.utility.stats.teamName,
    roster.left[0].stats.teamName,
    roster.left[1].stats.teamName,
    roster.left[2].stats.teamName,
    roster.center[0].stats.teamName,
    roster.center[1].stats.teamName,
    roster.center[2].stats.teamName,
    roster.right[0].stats.teamName,
    roster.right[1].stats.teamName,
    roster.right[2].stats.teamName,
    roster.defense[0].stats.teamName,
    roster.defense[1].stats.teamName,
    roster.defense[2].stats.teamName,
    roster.defense[3].stats.teamName,
    roster.goalie[0].stats.teamName,
    roster.goalie[1].stats.teamName,
  ];

  let playersRemaining = 16;

  teams.map((team) => {
    if (eliminatedTeams.includes(team)) {
      playersRemaining--;
    }
    return playersRemaining;
  })

  return playersRemaining;
}

export default eliminatedPlayers;