function eliminatedPlayers(roster, eliminatedTeamsList) {
  const allPlayers = [
    ...(roster.left || []),
    ...(roster.center || []),
    ...(roster.right || []),
    ...(roster.defense || []),
    ...(roster.utility ? [roster.utility] : []),
    ...(roster.goalie || []),
  ].filter(Boolean);

  const remainingPlayers = allPlayers.filter(player => !player.isEliminated);

  return remainingPlayers.length;
}

export default eliminatedPlayers;