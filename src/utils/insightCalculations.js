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
  return [...playerPickRate]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      // Tie-breaker: lower selection rate ranks higher (more impressive value).
      return (a.pickRate || 0) - (b.pickRate || 0);
    })
    .slice(0, topN);
};

/**
 * Get worst players by points
 * @param {Array} playerPickRate - Players with pick rate data
 * @param {number} bottomN - Number of players to return
 * @returns {Array} Bottom N lowest-scoring players
 */
export const getBottomPlayersByPoints = (playerPickRate, bottomN = 3) => {
  return [...playerPickRate]
    .sort((a, b) => {
      if (a.points !== b.points) return a.points - b.points;
      // Tie-breaker: higher selection rate ranks lower (more disappointing).
      return (b.pickRate || 0) - (a.pickRate || 0);
    })
    .slice(0, bottomN);
};

/**
 * Bucket each player into one of three position groups for fair peer comparison:
 * Forwards (L/C/R), Defense (D), Goalies (G). Goalies and defensemen score on
 * very different scales than forwards, so a single regression of points vs
 * pick rate across all positions produces misleading "expected points" values.
 */
const POSITION_GROUP = {
  L: 'F',
  C: 'F',
  R: 'F',
  D: 'D',
  G: 'G',
};

const getPositionGroup = (position) => POSITION_GROUP[position] || 'F';

/**
 * Ordinary least-squares fit: y = a + b*x.
 * Returns { a, b } so callers can compute expected y for any given x.
 */
const linearFit = (xs, ys) => {
  const n = xs.length;
  if (n === 0) return { a: 0, b: 0 };
  if (n === 1) return { a: ys[0], b: 0 };

  let sumX = 0, sumY = 0;
  for (let i = 0; i < n; i += 1) {
    sumX += xs[i];
    sumY += ys[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    num += dx * (ys[i] - meanY);
    den += dx * dx;
  }
  const b = den === 0 ? 0 : num / den;
  const a = meanY - b * meanX;
  return { a, b };
};

/**
 * Augment each player with an expected-points value derived from a per-position
 * regression of points vs. pick rate, plus residual-based bust/steal scores.
 *
 * Within each position group (F/D/G) we fit:  expectedPoints = a + b * pickRate
 * Then for each player:
 *   _expectedPoints  = a + b * player.pickRate     // what their pick rate predicted
 *   _pointsResidual  = actual - expected           // positive = beat expectation
 *   _bustScore       = expected - actual           // positive = underperformed
 *   _stealScore      = actual - expected           // positive = overperformed
 *
 * Because each group has its own regression line, a goalie with strong wins
 * sits above the goalie line (steal candidate), while a heavily-picked forward
 * with 0 points sits well below the forward line (bust candidate). Cross-
 * position comparisons can never trip the model because positions never share
 * a baseline.
 */
export const augmentWithValueScores = (playerPickRate) => {
  if (!playerPickRate || playerPickRate.length === 0) return [];

  const groups = {};
  for (const player of playerPickRate) {
    const group = getPositionGroup(player.position);
    if (!groups[group]) groups[group] = { pickRates: [], points: [] };
    groups[group].pickRates.push(player.pickRate || 0);
    groups[group].points.push(player.points || 0);
  }

  const fits = {};
  for (const [group, data] of Object.entries(groups)) {
    fits[group] = linearFit(data.pickRates, data.points);
  }

  return playerPickRate.map(player => {
    const group = getPositionGroup(player.position);
    const { a, b } = fits[group];
    const pickRate = player.pickRate || 0;
    const actual = player.points || 0;
    const expected = a + b * pickRate;
    const residual = actual - expected;
    return {
      ...player,
      _positionGroup: group,
      _expectedPoints: expected,
      _pointsResidual: residual,
      _bustScore: -residual,
      _stealScore: residual,
    };
  });
};

/**
 * Rank players by their value score (residual against expected points).
 *
 * Players are only included if they actually under/over-performed expectation;
 * a "bust" must have bustScore > 0 and a "steal" must have stealScore > 0.
 * An optional pick-rate threshold can further constrain the candidate pool:
 *   - mode 'steal': pickRate <= threshold (max ceiling)
 *   - mode 'bust' : pickRate >= threshold (min floor)
 * Pass `threshold = null` (or omit it) to skip the pick-rate filter entirely.
 *
 * @param {Array}        playerPickRate - Players with pick rate data
 * @param {number|null}  threshold      - Pick rate threshold (0-100) or null to disable
 * @param {string}       mode           - 'steal' or 'bust'
 * @param {number}       topN           - Maximum number of players to return
 * @returns {Array} Players sorted by score desc with expected-points context
 */
export const getPlayersByValueScore = (playerPickRate, threshold = null, mode = 'bust', topN = 3) => {
  if (!playerPickRate || playerPickRate.length === 0) return [];

  const augmented = augmentWithValueScores(playerPickRate);

  const filtered = augmented.filter(p => {
    if (mode === 'steal') {
      if (p._stealScore <= 0) return false;
      if (threshold != null && Math.round(p.pickRate) > threshold) return false;
      return true;
    }
    if (p._bustScore <= 0) return false;
    if (threshold != null && p.pickRate < threshold) return false;
    return true;
  });

  // Sort by the score relevant to the mode. Ties broken first by pick rate
  // (more-picked busts and less-picked steals are more interesting), then by
  // raw points as a final tiebreak.
  const scored = [...filtered].sort((a, b) => {
    if (mode === 'steal') {
      if (b._stealScore !== a._stealScore) return b._stealScore - a._stealScore;
      if (a.pickRate !== b.pickRate) return a.pickRate - b.pickRate;
      return (b.points || 0) - (a.points || 0);
    }
    if (b._bustScore !== a._bustScore) return b._bustScore - a._bustScore;
    if (a.pickRate !== b.pickRate) return b.pickRate - a.pickRate;
    return (a.points || 0) - (b.points || 0);
  });

  return scored.slice(0, topN);
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
      if (player.isEliminated) {
        eliminatedCount++;
        sunkPoints += player.points || 0;
      }
    });

    const totalPoints = roster.points || 0;

    return {
      owner: roster.owner?.name || 'Unknown',
      sunkPoints,
      eliminatedCount,
      totalPoints,
      sunkPercentage: totalPoints > 0 ? +((sunkPoints / totalPoints) * 100).toFixed(1) : 0,
      avgEliminatedPoints: eliminatedCount > 0 ? +(sunkPoints / eliminatedCount).toFixed(1) : 0,
    };
  }).sort((a, b) => b.sunkPoints - a.sunkPoints);
};

/**
 * Calculate "Pool Vitality" — pool-wide aliveness across all rosters.
 *
 * For every player slot across every roster, count whether the player is
 * still alive (their team isn't eliminated) and how many points they've
 * contributed. Returns aggregate alive %s by picks and points, plus a
 * per-position breakdown and the highest-scoring alive vs eliminated player.
 *
 * Picks are weighted equally (pure "% of the pool still in it"). Points
 * are weighted by what each pick has actually delivered, so the two %s
 * tell different stories — e.g. 80% picks alive but only 60% points alive
 * means the eliminated picks were the high scorers.
 *
 * @param {Array}  rosters         - All user rosters (each with left/center/right/defense/goalie/utility arrays of augmented player objects).
 * @param {Array}  playerPickRate  - Deduped player pool (used for top-alive / top-eliminated callouts).
 * @param {Array}  eliminatedTeams - List of eliminated team names (for the "X of 32 teams eliminated" subtitle).
 * @returns {{
 *   overall:       { totalPicks, eliminatedPicks, totalPoints, eliminatedPoints, picksAlivePct, pointsAlivePct },
 *   byPosition:    Record<'L'|'C'|'R'|'D'|'G', { totalPicks, eliminatedPicks, totalPoints, eliminatedPoints, picksAlivePct, pointsAlivePct }>,
 *   eliminatedTeamCount: number,
 *   topAlivePlayer: object|null,
 *   topEliminatedPlayer: object|null,
 * }}
 */
export const calculatePoolVitality = (
  rosters,
  playerPickRate,
  eliminatedTeams,
  { eliminationsByRound = {}, completedRounds = [], atRiskTeams = [] } = {}
) => {
  const positions = ['L', 'C', 'R', 'D', 'G'];
  const emptyBucket = () => ({
    totalPicks: 0,
    eliminatedPicks: 0,
    totalPoints: 0,
    eliminatedPoints: 0,
  });

  const overall = emptyBucket();
  const byPosition = positions.reduce(
    (acc, pos) => ({ ...acc, [pos]: emptyBucket() }),
    {}
  );

  // Per-team aggregates so we can later compute "what would alive% drop to if
  // team X gets eliminated next?" without rewalking the rosters.
  const byTeam = new Map();
  const ensureTeamBucket = (teamName) => {
    if (!teamName) return null;
    if (!byTeam.has(teamName)) byTeam.set(teamName, emptyBucket());
    return byTeam.get(teamName);
  };

  (rosters || []).forEach((roster) => {
    const slots = [
      ...(roster.left || []),
      ...(roster.center || []),
      ...(roster.right || []),
      ...(roster.defense || []),
      ...(roster.goalie || []),
      ...(roster.utility ? [roster.utility] : []),
    ].filter(Boolean);

    slots.forEach((player) => {
      const points = player.points || 0;
      const pos = player.position;
      const eliminated = !!player.isEliminated;
      const teamName = player.teamName || player.team || null;

      overall.totalPicks += 1;
      overall.totalPoints += points;
      if (eliminated) {
        overall.eliminatedPicks += 1;
        overall.eliminatedPoints += points;
      }

      // Bucket utility players by their actual NHL position (e.g. a goalie
      // in the utility slot still counts as G).
      if (byPosition[pos]) {
        byPosition[pos].totalPicks += 1;
        byPosition[pos].totalPoints += points;
        if (eliminated) {
          byPosition[pos].eliminatedPicks += 1;
          byPosition[pos].eliminatedPoints += points;
        }
      }

      const teamBucket = ensureTeamBucket(teamName);
      if (teamBucket) {
        teamBucket.totalPicks += 1;
        teamBucket.totalPoints += points;
      }
    });
  });

  const withAlivePcts = (b) => ({
    ...b,
    picksAlivePct: b.totalPicks
      ? +(((b.totalPicks - b.eliminatedPicks) / b.totalPicks) * 100).toFixed(1)
      : 0,
    pointsAlivePct: b.totalPoints
      ? +(((b.totalPoints - b.eliminatedPoints) / b.totalPoints) * 100).toFixed(1)
      : 0,
  });

  // Highest-scoring alive vs eliminated player across the deduplicated pool.
  // Restrict to players that were actually drafted; an unselected player
  // shouldn't show up as "the most-valuable alive pick."
  const drafted = (playerPickRate || []).filter((p) => (p.pickCount || 0) > 0);
  const sortedByPoints = [...drafted].sort(
    (a, b) => (b.points || 0) - (a.points || 0)
  );
  const topAlivePlayer = sortedByPoints.find((p) => !p.isEliminated) || null;
  const topEliminatedPlayer = sortedByPoints.find((p) => p.isEliminated) || null;

  // ---- Round-end markers --------------------------------------------------
  // Only emit a tick for rounds that are fully resolved. Mid-round counts
  // would shift each time another team gets eliminated, which is misleading
  // when the tick is labelled "End of Round R."
  // Picks are temporally stable so the picks % is exact. Points uses today's
  // totals for both numerator and denominator (we don't have historical
  // snapshots), so it represents "of the points scored to date, what fraction
  // came from teams still alive at the end of round R."
  const completedRoundSet = new Set(completedRounds.map(Number));
  const roundsSorted = Object.keys(eliminationsByRound)
    .map((r) => Number(r))
    .filter((r) => Number.isFinite(r))
    .sort((a, b) => a - b);

  const roundMarkers = [];
  let cumulativeEliminatedPicks = 0;
  let cumulativeEliminatedPoints = 0;
  roundsSorted.forEach((round) => {
    const teamsThisRound = eliminationsByRound[round] || [];
    teamsThisRound.forEach((teamName) => {
      const bucket = byTeam.get(teamName);
      if (!bucket) return;
      cumulativeEliminatedPicks += bucket.totalPicks;
      cumulativeEliminatedPoints += bucket.totalPoints;
    });
    if (!completedRoundSet.has(round) || teamsThisRound.length === 0) return;
    const picksAlivePct = overall.totalPicks
      ? +(((overall.totalPicks - cumulativeEliminatedPicks) / overall.totalPicks) * 100).toFixed(1)
      : 0;
    const pointsAlivePct = overall.totalPoints
      ? +(((overall.totalPoints - cumulativeEliminatedPoints) / overall.totalPoints) * 100).toFixed(1)
      : 0;
    roundMarkers.push({
      round,
      teams: teamsThisRound,
      picksAlivePct,
      pointsAlivePct,
    });
  });

  // ---- At-risk forecast markers ------------------------------------------
  // For each team currently one loss from elimination, project where the
  // bars would land if they fall. We assume the team's current bucket (today's
  // pick share + today's points) is what would be "newly eliminated."
  const atRiskMarkers = (atRiskTeams || [])
    .map((t) => {
      const bucket = t.name ? byTeam.get(t.name) : null;
      if (!bucket) return null;
      const newEliminatedPicks = overall.eliminatedPicks + bucket.totalPicks;
      const newEliminatedPoints = overall.eliminatedPoints + bucket.totalPoints;
      const projectedPicksAlivePct = overall.totalPicks
        ? +(((overall.totalPicks - newEliminatedPicks) / overall.totalPicks) * 100).toFixed(1)
        : 0;
      const projectedPointsAlivePct = overall.totalPoints
        ? +(((overall.totalPoints - newEliminatedPoints) / overall.totalPoints) * 100).toFixed(1)
        : 0;
      return {
        name: t.name,
        commonName: t.commonName,
        abbrev: t.abbrev,
        ownWins: t.ownWins,
        otherWins: t.otherWins,
        neededToWin: t.neededToWin,
        picksAtStake: bucket.totalPicks,
        pointsAtStake: bucket.totalPoints,
        projectedPicksAlivePct,
        projectedPointsAlivePct,
      };
    })
    .filter(Boolean);

  return {
    overall: withAlivePcts(overall),
    byPosition: positions.reduce(
      (acc, pos) => ({ ...acc, [pos]: withAlivePcts(byPosition[pos]) }),
      {}
    ),
    eliminatedTeamCount: (eliminatedTeams || []).length,
    topAlivePlayer,
    topEliminatedPlayer,
    roundMarkers,
    atRiskMarkers,
  };
};

/**
 * Calculate "Clutch Factor" — playoff performance vs regular season baseline
 * Compares PPG in playoffs against regular season to surface over/underperformers.
 * @param {Array} players - Playoff players with points, gamesPlayed, position, goals, assists, etc.
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
        playoffPPG = ((player.goals || 0) + (player.assists || 0)) / player.gamesPlayed;
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
      if (player.teamName) uniqueTeams.add(player.teamName);
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
 * @param {Array} players - Normalized player list (with goals/otGoals/wins/shutouts fields)
 * @param {number} topN - Number of players to return
 * @returns {Array} Top bonus point earners sorted by bonus points descending
 */
export const getBonusHunters = (players, topN = 10) => {
  const skaterBonuses = players
    .filter(p => p.position !== 'G' && (p.otGoals || 0) > 0)
    .map(p => ({
      ...p,
      bonusPoints: p.otGoals,
      bonusLabel: `${p.otGoals} OTG${p.otGoals !== 1 ? 's' : ''}`,
    }));

  const goalieBonuses = players
    .filter(p => p.position === 'G' && (p.shutouts || 0) > 0)
    .map(p => ({
      ...p,
      bonusPoints: p.shutouts * 2,
      bonusLabel: `${p.shutouts} SO${p.shutouts !== 1 ? 's' : ''}`,
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
    .filter(p => p.pickCount === 1)
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
