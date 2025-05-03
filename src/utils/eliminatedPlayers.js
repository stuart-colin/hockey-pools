function eliminatedPlayers(roster, eliminatedTeamsList) {
  const safeEliminatedList = Array.isArray(eliminatedTeamsList) ? eliminatedTeamsList : [];

  const allPlayers = [
    ...(roster.left || []),
    ...(roster.center || []),
    ...(roster.right || []),
    ...(roster.defense || []),
    ...(roster.goalie || []),
    ...(roster.utility ? [roster.utility] : []),
  ].filter(Boolean);

  const remainingPlayers = allPlayers.filter(player =>
    player.stats && player.stats.teamName && !safeEliminatedList.includes(player.stats.teamName)
  );

  return remainingPlayers.length;
}

export default eliminatedPlayers;