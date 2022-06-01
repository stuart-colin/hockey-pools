import eliminatedTeams from '../constants/eliminatedTeams';

function eliminatedPlayers(roster) {
  const teams = [
    roster.utility.team.name,
    roster.left[0].team.name,
    roster.left[1].team.name,
    roster.left[2].team.name,
    roster.center[0].team.name,
    roster.center[1].team.name,
    roster.center[2].team.name,
    roster.right[0].team.name,
    roster.right[1].team.name,
    roster.right[2].team.name,
    roster.defense[0].team.name,
    roster.defense[1].team.name,
    roster.defense[2].team.name,
    roster.defense[3].team.name,
    roster.goalie[0].team.name,
    roster.goalie[1].team.name,
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