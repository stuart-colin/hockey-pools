/**
 * Utility functions for Insights component calculations
 */

import { customSort } from './stats';
import { ROSTER_LIMITS, TOTAL_ROSTER_SIZE } from '../constants/insights';

/**
 * Add pick rate percentage to each player
 * @param {Array} players - Array of player objects
 * @param {number} totalRosters - Total number of rosters/users
 * @returns {Array} Players with added pickRate field
 */
export const buildPlayerPickRate = (players, totalRosters) => {
  return players.map(p => ({
    ...p,
    pickRate: (p.pickCount / totalRosters) * 100
  }));
};

/**
 * Get players for a specific position, sorted and limited
 * @param {Array} players - Player list to filter
 * @param {string} position - Position code ('L', 'C', 'R', 'D', 'G')
 * @param {number} limit - Maximum players to return
 * @param {string} sortBy - Field to sort by (default: 'points')
 * @param {boolean} sortByPoints - Whether to sort by points (true) or keep pick order (false)
 * @returns {Array} Filtered and limited players
 */
export const getPlayersByPosition = (players, position, limit, sortByPoints = true) => {
  const filtered = players.filter(player => player.position === position);

  if (sortByPoints) {
    return customSort(filtered, 'points').slice(0, limit);
  }

  return filtered.slice(0, limit);
};

/**
 * Build a complete 16-player roster for a given strategy
 * @param {Array} playerPickRate - Players with pick rate data
 * @param {Array} positions - Position codes to build ['L', 'C', 'R', 'D', 'G']
 * @param {boolean} sortByPoints - Sort by points (best team) or keep pick order (common team)
 * @returns {Array} Complete roster of 16 players
 */
export const buildTeam = (playerPickRate, positions = ['L', 'C', 'R', 'D', 'G'], sortByPoints = true) => {
  const positionLimits = [
    ROSTER_LIMITS.L,
    ROSTER_LIMITS.C,
    ROSTER_LIMITS.R,
    ROSTER_LIMITS.D,
    ROSTER_LIMITS.G
  ];

  // Build team by position
  const teamByPosition = positions.map((pos, idx) => {
    if (sortByPoints) {
      return customSort(playerPickRate, 'points').filter(p => p.position === pos).slice(0, positionLimits[idx]);
    }
    return playerPickRate.filter(p => p.position === pos).slice(0, positionLimits[idx]);
  }).flat();

  // Fill remaining utility slots with best available players not already on team
  const remainingSlots = TOTAL_ROSTER_SIZE - teamByPosition.length;
  const usedIds = new Set(teamByPosition.map(p => p.id));
  const utilityPlayers = sortByPoints
    ? customSort(playerPickRate, 'points').filter(p => !usedIds.has(p.id)).slice(0, remainingSlots)
    : playerPickRate.filter(p => !usedIds.has(p.id)).slice(0, remainingSlots);

  return teamByPosition.concat(utilityPlayers);
};

/**
 * Build the best team (highest point scorers by position)
 * @param {Array} playerPickRate - Players with pick rate data
 * @returns {Array} Best roster sorted by points
 */
export const buildBestTeam = (playerPickRate) => {
  return buildTeam(playerPickRate, ['L', 'C', 'R', 'D', 'G'], true);
};

/**
 * Build the most common team (most picked players by position)
 * @param {Array} playerPickRate - Players with pick rate data
 * @returns {Array} Most common roster in pick order
 */
export const buildCommonTeam = (playerPickRate) => {
  return buildTeam(playerPickRate, ['L', 'C', 'R', 'D', 'G'], false);
};

/**
 * Calculate team statistics (total points and non-eliminated count)
 * @param {Array} team - Array of players on the team
 * @param {number} totalRosterSize - Total roster size (default: 16)
 * @returns {Object} { points: number, remaining: number }
 */
export const calculateTeamStats = (team, totalRosterSize = TOTAL_ROSTER_SIZE) => {
  let points = 0;
  let remaining = totalRosterSize;

  team.forEach(player => {
    if (player.isEliminated) {
      remaining--;
    }
    points += player.points || 0;
  });

  return { points, remaining };
};

/**
 * Split array into chunks of specified size
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Get pick rate range from player data
 * @param {Array} playerPickRate - Players with pick rate data
 * @returns {Object} { min: number, max: number }
 */
export const getPickRateRange = (playerPickRate) => {
  if (!playerPickRate || playerPickRate.length === 0) {
    return { min: 0, max: 100 };
  }

  const pickRates = playerPickRate.map(p => p.pickRate || 0);
  const min = Math.floor(Math.min(...pickRates));
  const max = Math.ceil(Math.max(...pickRates));

  return { min, max };
};

/**
 * Get players from a team for a specific position label
 * @param {Array} team - Full team roster
 * @param {string} positionLabel - Position label ('Left', 'Center', 'Right', 'Defense', 'Goalie')
 * @returns {Array} Players on the team for that position
 */
export const getTeamByPosition = (team, positionLabel) => {
  const positionMap = {
    'Left': 'L',
    'Center': 'C',
    'Right': 'R',
    'Defense': 'D',
    'Goalie': 'G'
  };

  const posCode = positionMap[positionLabel];
  if (posCode) {
    return team.filter(p => p.position === posCode);
  }

  // Catch-all for utility/bench players
  return team.filter(p => !['L', 'C', 'R', 'D', 'G'].includes(p.position));
};

/**
 * Get most picked players (top N by pick count)
 * @param {Array} playerPickRate - Players with pick rate data
 * @param {number} topN - Number of players to return
 * @returns {Array} Top N most picked players
 */
export const getMostPickedPlayers = (playerPickRate, topN = 3) => {
  return playerPickRate.slice(0, topN);
};

/**
 * Get best players by points
 * @param {Array} playerPickRate - Players with pick rate data
 * @param {number} topN - Number of players to return
 * @returns {Array} Top N highest-scoring players
 */
export const getTopPlayersByPoints = (playerPickRate, topN = 3) => {
  return customSort(playerPickRate, 'points').slice(0, topN);
};

/**
 * Get worst players by points
 * @param {Array} playerPickRate - Players with pick rate data
 * @param {number} bottomN - Number of players to return
 * @returns {Array} Bottom N lowest-scoring players
 */
export const getBottomPlayersByPoints = (playerPickRate, bottomN = 3) => {
  return customSort(playerPickRate, 'points')
    .slice(-bottomN)
    .reverse();
};

/**
 * Get players filtered by pick rate threshold
 * @param {Array} playerPickRate - Players with pick rate data
 * @param {number} threshold - Pick rate threshold (0-100)
 * @param {string} mode - 'above' (high threshold) or 'below' (low threshold)
 * @param {number} topN - Number of players to return
 * @returns {Array} Filtered and sorted players
 */
export const getPlayersByPickRateThreshold = (playerPickRate, threshold, mode = 'below', topN = 3) => {
  let filtered;

  if (mode === 'below') {
    // High threshold: most advantageous (below threshold)
    filtered = playerPickRate.filter(p => Math.round(p.pickRate) <= threshold);
  } else {
    // Low threshold: least advantageous (above/equal threshold)
    filtered = playerPickRate.filter(p => p.pickRate >= threshold);
  }

  const sorted = customSort(filtered, 'points');
  return mode === 'below'
    ? sorted.slice(0, topN)
    : sorted.slice(-topN).reverse();
};

/**
 * Calculate pool statistics (most/average/least for players remaining and points)
 * @param {Array} rosters - User rosters array
 * @param {Function} minFn - Min function from stats
 * @param {Function} maxFn - Max function from stats
 * @param {Function} meanFn - Mean function from stats
 * @returns {Object} Pool statistics
 */

/**
 * Calculate median of array
 */
const calculateMedian = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculate percentile of array
 */
const calculatePercentile = (arr, p) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

export const calculatePoolStats = (rosters, minFn, maxFn, meanFn) => {
  const playersRemaining = rosters.map(u => u.playersRemaining);
  const points = rosters.map(u => u.points);

  return {
    mostPlayersRemaining: maxFn(playersRemaining),
    averagePlayersRemaining: meanFn(playersRemaining).toFixed(0),
    medianPlayersRemaining: Math.round(calculateMedian(playersRemaining)),
    q1PlayersRemaining: Math.round(calculatePercentile(playersRemaining, 25)),
    q3PlayersRemaining: Math.round(calculatePercentile(playersRemaining, 75)),
    leastPlayersRemaining: minFn(playersRemaining),
    mostPoints: maxFn(points),
    averagePoints: meanFn(points).toFixed(0),
    medianPoints: Math.round(calculateMedian(points)),
    q1Points: Math.round(calculatePercentile(points, 25)),
    q3Points: Math.round(calculatePercentile(points, 75)),
    leastPoints: minFn(points),
  };
};

/**
 * Get the most valuable eliminated players
 * @param {Array} players - All players with pick rate and elimination status
 * @param {number} topN - Number of players to return
 * @returns {Array} Top N eliminated players by points scored
 */
export const getTopEliminatedPlayers = (players, topN = 10) => {
  return customSort(
    players.filter(p => p.isEliminated),
    'points'
  ).slice(0, topN);
};

/**
 * Calculate position-specific impact of eliminations
 * @param {Array} players - All players with position and elimination status
 * @returns {Object} Points lost by position with totals and percentages
 */
export const calculatePositionEliminionImpact = (players) => {
  const positions = ['L', 'C', 'R', 'D', 'G'];
  const eliminatedPlayers = players.filter(p => p.isEliminated);
  const totalPoolPoints = players.reduce((sum, p) => sum + p.points, 0);

  // Calculate impact per position
  const positionImpact = {};
  positions.forEach(pos => {
    const pointsLostByPosition = eliminatedPlayers
      .filter(p => p.position === pos)
      .reduce((sum, p) => sum + p.points, 0);

    positionImpact[pos] = {
      pointsLost: pointsLostByPosition,
      percentage: totalPoolPoints > 0 ? ((pointsLostByPosition / totalPoolPoints) * 100).toFixed(1) : 0,
      count: eliminatedPlayers.filter(p => p.position === pos).length,
    };
  });

  // Rank by impact (most points lost first)
  const rankedByImpact = Object.entries(positionImpact)
    .map(([pos, data]) => ({ position: pos, ...data }))
    .sort((a, b) => b.pointsLost - a.pointsLost);

  return {
    byPosition: positionImpact,
    rankedByImpact,
    totalPointsLost: eliminatedPlayers.reduce((sum, p) => sum + p.points, 0),
    totalPoolPoints,
  };
};

/**
 * Calculate sunk cost per roster — points locked in eliminated players
 * @param {Array} rosters - User rosters with position arrays
 * @param {Array} eliminatedTeams - List of eliminated team names
 * @returns {Array} Rosters ranked by sunk points (descending)
 */
export const calculateSunkCosts = (rosters, eliminatedTeams) => {
  const safeEliminated = Array.isArray(eliminatedTeams) ? eliminatedTeams : [];

  return rosters.map(roster => {
    const allPlayers = [
      ...(roster.left || []),
      ...(roster.center || []),
      ...(roster.right || []),
      ...(roster.defense || []),
      ...(roster.goalie || []),
      ...(roster.utility ? [roster.utility] : []),
    ].filter(Boolean);

    let sunkPoints = 0;
    let eliminatedCount = 0;

    allPlayers.forEach(player => {
      const teamName = player.stats && player.stats.teamName;
      if (teamName && safeEliminated.includes(teamName)) {
        eliminatedCount++;
        const isGoalie = player.position === 'G';
        const stats = player.stats?.featuredStats?.playoffs?.subSeason;
        if (stats) {
          sunkPoints += isGoalie
            ? (stats.wins * 2) + (stats.shutouts * 2) + (player.stats.otl || 0)
            : stats.goals + stats.assists + stats.otGoals;
        }
      }
    });

    const totalPoints = roster.points || 0;

    return {
      owner: roster.owner?.name || 'Unknown',
      sunkPoints,
      eliminatedCount,
      totalPoints,
      sunkPercentage: totalPoints > 0 ? +((sunkPoints / totalPoints) * 100).toFixed(1) : 0,
    };
  }).sort((a, b) => b.sunkPoints - a.sunkPoints);
};

/**
 * Calculate "Clutch Factor" — playoff performance vs regular season baseline
 * Compares PPG in playoffs against regular season to surface over/underperformers.
 * @param {Array} players - Playoff players with points, gamesPlayed, position, stat1, stat2
 * @param {Object} regularSeasonStats - { skaterStats, goalieStats, loading } from useRegularSeasonStats
 * @returns {Array} Players with clutchRating, sorted by biggest overperformers first
 */
export const calculateClutchFactor = (players, regularSeasonStats) => {
  if (!regularSeasonStats || regularSeasonStats.loading) return [];

  const { skaterStats = [], goalieStats = [] } = regularSeasonStats;

  const rsSkaterMap = new Map();
  skaterStats.forEach(s => { if (s.skaterFullName) rsSkaterMap.set(s.skaterFullName, s); });

  const rsGoalieMap = new Map();
  goalieStats.forEach(g => { if (g.goalieFullName) rsGoalieMap.set(g.goalieFullName, g); });

  return players
    .filter(p => p.gamesPlayed > 0)
    .map(player => {
      const isGoalie = player.position === 'G';
      let rsPPG, playoffPPG;

      if (isGoalie) {
        const rs = rsGoalieMap.get(player.name);
        if (!rs || !rs.gamesPlayed) return null;
        rsPPG = ((rs.wins * 2) + (rs.shutouts * 2) + (rs.otLosses || 0)) / rs.gamesPlayed;
        playoffPPG = player.points / player.gamesPlayed;
      } else {
        const rs = rsSkaterMap.get(player.name);
        if (!rs || !rs.gamesPlayed) return null;
        // Compare standard PPG (goals + assists / GP) for fair comparison
        rsPPG = rs.points / rs.gamesPlayed;
        playoffPPG = (player.stat1 + player.stat2) / player.gamesPlayed;
      }

      return {
        ...player,
        playoffPPG: +playoffPPG.toFixed(2),
        regularSeasonPPG: +rsPPG.toFixed(2),
        clutchRating: +(playoffPPG - rsPPG).toFixed(2),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.clutchRating - a.clutchRating);
};

/**
 * Calculate roster diversity — frequency distribution of how many NHL teams rosters draw from
 * @param {Array} rosters - User rosters with position arrays
 * @param {Array} eliminatedTeams - List of eliminated team names
 * @returns {Array} Frequency distribution sorted by team count ascending
 */
export const calculateRosterDiversity = (rosters, eliminatedTeams) => {
  const frequency = {};

  rosters.forEach(roster => {
    const allPlayers = [
      ...(roster.left || []),
      ...(roster.center || []),
      ...(roster.right || []),
      ...(roster.defense || []),
      ...(roster.goalie || []),
      ...(roster.utility ? [roster.utility] : []),
    ].filter(Boolean);

    const uniqueTeams = new Set();
    allPlayers.forEach(player => {
      const teamName = player.stats && player.stats.teamName;
      if (teamName) uniqueTeams.add(teamName);
    });

    const count = uniqueTeams.size;
    frequency[count] = (frequency[count] || 0) + 1;
  });

  return Object.entries(frequency)
    .map(([teamCount, rosterCount]) => ({
      teamCount: Number(teamCount),
      rosterCount,
      percentage: +((rosterCount / rosters.length) * 100).toFixed(1),
    }))
    .sort((a, b) => a.teamCount - b.teamCount);
};

/**
 * Get players earning disproportionate bonus points (OT goals for skaters, shutouts for goalies)
 * @param {Array} players - All players with stat fields
 * @param {number} topN - Number of players to return
 * @returns {Array} Top bonus point earners sorted by bonus points descending
 */
export const getBonusHunters = (players, topN = 10) => {
  const skaterBonuses = players
    .filter(p => p.position !== 'G' && p.stat3 > 0)
    .map(p => ({
      ...p,
      bonusPoints: p.stat3,
      bonusLabel: `${p.stat3} OT goal${p.stat3 !== 1 ? 's' : ''}`,
    }));

  const goalieBonuses = players
    .filter(p => p.position === 'G' && p.stat2 > 0)
    .map(p => ({
      ...p,
      bonusPoints: p.stat2 * 2,
      bonusLabel: `${p.stat2} shutout${p.stat2 !== 1 ? 's' : ''}`,
    }));

  return [...skaterBonuses, ...goalieBonuses]
    .sort((a, b) => b.bonusPoints - a.bonusPoints)
    .slice(0, topN);
};

/**
 * Get players that only appear on a single roster — unique differentiators
 * @param {Array} players - All players with pickCount
 * @param {number} topN - Number of players to return
 * @returns {Array} Unique picks sorted by points descending
 */
export const getLoneWolves = (players, topN = 10) => {
  return players
    .filter(p => p.pickCount === 1 && p.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, topN);
};

/**
 * Calculate average points per player by position across the pool
 * @param {Array} players - All players with position and points
 * @returns {Array} Position stats sorted by avg points per player (descending)
 */
export const calculatePositionPointsBreakdown = (players) => {
  const positions = ['L', 'C', 'R', 'D', 'G'];
  const positionLabels = { L: 'Left Wing', C: 'Center', R: 'Right Wing', D: 'Defense', G: 'Goalie' };

  const totalPoolPoints = players.reduce((sum, p) => sum + (p.points || 0), 0);

  return positions.map(pos => {
    const posPlayers = players.filter(p => p.position === pos);
    const totalPoints = posPlayers.reduce((sum, p) => sum + (p.points || 0), 0);
    const remaining = posPlayers.filter(p => !p.isEliminated).length;

    return {
      position: pos,
      label: positionLabels[pos],
      totalPoints,
      playerCount: posPlayers.length,
      remaining,
      avgPoints: posPlayers.length > 0 ? +(totalPoints / posPlayers.length).toFixed(1) : 0,
      shareOfPool: totalPoolPoints > 0 ? +((totalPoints / totalPoolPoints) * 100).toFixed(1) : 0,
    };
  }).sort((a, b) => b.avgPoints - a.avgPoints);
};
