import { POSITION_COUNTS } from '../constants/teambuilder';

/**
 * Extract team abbreviation from comma-separated team string
 */
export const getTeamAbbrev = (teamAbbrevs) => {
  return teamAbbrevs.split(/[,]+/).pop();
};

/**
 * Get player's display name based on position
 */
export const getPlayerName = (player) => {
  return player.positionCode === 'G'
    ? player.goalieFullName
    : player.skaterFullName;
};

/**
 * Get stats display string based on position
 */
export const getPlayerStatsDisplay = (player) => {
  const { positionCode, gamesPlayed } = player;

  if (positionCode === 'G') {
    const { wins, losses, otLosses } = player;
    return `GP: ${gamesPlayed} W: ${wins} L: ${losses} OTL: ${otLosses}`;
  }

  const { goals, assists, points } = player;
  return `GP: ${gamesPlayed} G: ${goals} A: ${assists} P: ${points}`;
};

/**
 * Calculate how many of each position are selected
 */
export const calculatePositionLimits = (myTeam) => {
  return myTeam.reduce((acc, player) => {
    acc[player.positionCode] = (acc[player.positionCode] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Calculate how many players from each team are selected
 */
export const calculateTeamCount = (myTeam) => {
  return myTeam.reduce((acc, player) => {
    const team = getTeamAbbrev(player.teamAbbrevs);
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Check if utility bonus is available
 * (positions that can accept one extra player)
 * Returns 0 if a utility player has already been assigned, 1 if slot is available
 */
export const calculateUtilityBonus = (positionLimit) => {
  // If any position has exceeded its count, utility slot is taken
  const hasUtilityPlayer = Object.entries(POSITION_COUNTS).some(
    ([position, limit]) => positionLimit[position] > limit
  );
  return hasUtilityPlayer ? 0 : 1;
};

/**
 * Check if a player can be selected
 * Returns true if position is full and no utility bonus
 */
export const isPlayerDisabled = (player, positionLimit, utilityBonus) => {
  const limit = POSITION_COUNTS[player.positionCode];
  return positionLimit[player.positionCode] >= limit + utilityBonus;
};

/**
 * Build the roster IDs object for submission
 */
export const buildTeamIds = (myTeam, userId) => {
  const remainingPlayers = [...myTeam];

  // Find utility player (first one who exceeded position limit)
  const utilityPlayerIndex = remainingPlayers.findIndex((p) => {
    const positionCount = remainingPlayers.filter(
      (player) => player.positionCode === p.positionCode
    ).length;
    return positionCount > POSITION_COUNTS[p.positionCode];
  });

  const utilityPlayer =
    utilityPlayerIndex !== -1
      ? remainingPlayers.splice(utilityPlayerIndex, 1)[0]
      : null;

  // Helper to get player IDs for a specific position
  const getPlayersByPosition = (players, positionCode) =>
    players.filter((p) => p.positionCode === positionCode).map((p) => p.playerId);

  return {
    owner: userId,
    center: getPlayersByPosition(remainingPlayers, 'C'),
    left: getPlayersByPosition(remainingPlayers, 'L'),
    right: getPlayersByPosition(remainingPlayers, 'R'),
    defense: getPlayersByPosition(remainingPlayers, 'D'),
    goalie: getPlayersByPosition(remainingPlayers, 'G'),
    utility: utilityPlayer ? [utilityPlayer.playerId] : [],
  };
};

/**
 * Filter players by name, team, and position
 */
export const filterPlayers = (players, nameSearch, teamFilter, positionFilter) => {
  return players.filter((player) => {
    const matchesPosition = positionFilter.length
      ? positionFilter.includes(player.positionCode)
      : true;

    const matchesTeam = teamFilter.length
      ? teamFilter.includes(getTeamAbbrev(player.teamAbbrevs))
      : true;

    const playerName = getPlayerName(player).toLowerCase();
    const matchesName = nameSearch
      ? playerName.includes(nameSearch.toLowerCase())
      : true;

    return matchesPosition && matchesTeam && matchesName;
  });
};

/**
 * Sort players by relevant stat
 */
export const sortPlayers = (players, isGoalie) => {
  return [...players].sort((a, b) => {
    if (isGoalie) {
      return b.wins - a.wins;
    }
    return b.points - a.points;
  });
};
