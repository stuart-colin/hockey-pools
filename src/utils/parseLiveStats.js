import { calculateSkaterPoints, calculateGoaliePoints } from './points';
import countPoints from './countPoints';
import { POSITION_ARRAYS } from '../constants/positions';

/**
 * Parse live game data from the NHL scores API and produce per-player stat deltas
 * for pool participants only.
 *
 * @param {Array} games - Array of game objects from the NHL scores endpoint
 * @param {Set<number>} poolPlayerIds - Set of nhl_ids for all players in the pool
 * @returns {{ playerDeltas: Map<number, object>, hasLiveGames: boolean }}
 */
export const parseLivePlayerStats = (games, poolPlayerIds) => {
  const playerDeltas = new Map();

  if (!games || !Array.isArray(games) || !poolPlayerIds || poolPlayerIds.size === 0) {
    return { playerDeltas, hasLiveGames: false };
  }

  const activeStates = new Set(['LIVE', 'OFF', 'FINAL']);
  const activeGames = games.filter(g => activeStates.has(g.gameState));
  const hasLiveGames = games.some(g => g.gameState === 'LIVE');

  for (const game of activeGames) {
    const goals = game.goals;
    if (!Array.isArray(goals)) continue;

    for (const goal of goals) {
      const scorerId = goal.playerId;

      // Count goal for scorer (if in pool)
      if (poolPlayerIds.has(scorerId)) {
        const delta = getOrCreateDelta(playerDeltas, scorerId);
        delta.goals += 1;

        // Check for OT goal
        if (goal.periodDescriptor?.periodType === 'OT') {
          delta.otGoals += 1;
        }
      }

      // Count assists
      if (Array.isArray(goal.assists)) {
        for (const assist of goal.assists) {
          if (poolPlayerIds.has(assist.playerId)) {
            const delta = getOrCreateDelta(playerDeltas, assist.playerId);
            delta.assists += 1;
          }
        }
      }
    }
  }

  // Calculate points for each player delta
  for (const [, delta] of playerDeltas) {
    delta.points = calculateSkaterPoints(delta.goals, delta.assists, delta.otGoals);
  }

  return { playerDeltas, hasLiveGames };
};

/**
 * Build a Set of all pool player nhl_ids from the rosters array.
 *
 * @param {Array} rosters - Array of roster objects (with normalized players)
 * @returns {Set<number>}
 */
export const buildPoolPlayerIds = (rosters) => {
  const ids = new Set();
  if (!rosters || !Array.isArray(rosters)) return ids;

  for (const roster of rosters) {
    for (const pos of POSITION_ARRAYS) {
      if (Array.isArray(roster[pos])) {
        for (const player of roster[pos]) {
          if (player?.id) ids.add(player.id);
        }
      }
    }
    if (roster.utility?.id) ids.add(roster.utility.id);
  }

  return ids;
};

/**
 * Augment a single roster's players with live stat deltas.
 * Clones each player and attaches a _delta property with today's stats.
 * Augmented flat fields (goals, assists, etc.) include live additions.
 *
 * @param {object} roster - A roster object with position arrays and utility
 * @param {Map<number, object>} playerDeltas - Map of nhl_id → { goals, assists, otGoals, points }
 * @returns {object} - New roster with augmented player objects
 */
export const augmentRoster = (roster, playerDeltas) => {
  if (!roster || !playerDeltas || playerDeltas.size === 0) return roster;

  const augmentPlayer = (player) => {
    if (!player) return player;
    const delta = playerDeltas.get(player.id);
    if (!delta) return { ...player, _delta: null };
    const isGoalie = player.position === 'G';
    if (isGoalie) {
      return {
        ...player,
        wins: (player.wins || 0) + (delta.wins || 0),
        shutouts: (player.shutouts || 0) + (delta.shutouts || 0),
        otl: (player.otl || 0) + (delta.otl || 0),
        points: (player.points || 0) + delta.points,
        _delta: { ...delta },
      };
    }
    return {
      ...player,
      goals: (player.goals || 0) + (delta.goals || 0),
      assists: (player.assists || 0) + (delta.assists || 0),
      otGoals: (player.otGoals || 0) + (delta.otGoals || 0),
      points: (player.points || 0) + delta.points,
      _delta: { ...delta },
    };
  };

  const augmented = { ...roster };
  for (const pos of POSITION_ARRAYS) {
    if (Array.isArray(augmented[pos])) {
      augmented[pos] = augmented[pos].map(augmentPlayer);
    }
  }
  if (augmented.utility) {
    augmented.utility = augmentPlayer(augmented.utility);
  }

  // Recalculate roster-level points total from augmented players
  augmented.points = countPoints(augmented);

  return augmented;
};

/**
 * Parse live goalie stats from NHL boxscore data and produce per-goalie stat deltas
 * for pool participants only.
 *
 * @param {Array} boxscores - Array of boxscore objects from the NHL gamecenter API
 * @param {Set<number>} poolPlayerIds - Set of nhl_ids for all players in the pool
 * @returns {Map<number, object>} - Map of goalie nhl_id → { wins, shutouts, otl, points }
 */
export const parseLiveGoalieStats = (boxscores, poolPlayerIds) => {
  const goalieDeltas = new Map();

  if (!boxscores || !Array.isArray(boxscores) || !poolPlayerIds || poolPlayerIds.size === 0) {
    return goalieDeltas;
  }

  for (const boxscore of boxscores) {
    const gameState = boxscore.gameState;
    // Only process completed or live games
    if (gameState !== 'FINAL' && gameState !== 'OFF' && gameState !== 'LIVE') continue;

    const lastPeriodType = boxscore.gameOutcome?.lastPeriodType; // 'REG', 'OT', 'SO'

    const sides = ['homeTeam', 'awayTeam'];
    for (const side of sides) {
      const goalies = boxscore.playerByGameStats?.[side]?.goalies;
      if (!Array.isArray(goalies)) continue;

      for (const goalie of goalies) {
        const goalieId = goalie.playerId;
        if (!poolPlayerIds.has(goalieId)) continue;

        // Only goalies with a decision have actionable stats
        if (!goalie.decision) continue;

        const delta = getOrCreateGoalieDelta(goalieDeltas, goalieId);

        if (goalie.decision === 'W') {
          delta.wins += 1;
          // Shutout: must be starter AND 0 goals against
          if (goalie.starter === true && goalie.goalsAgainst === 0) {
            delta.shutouts += 1;
          }
        } else if (goalie.decision === 'L') {
          // OTL: loss in OT or SO (not regulation)
          if (lastPeriodType && lastPeriodType !== 'REG') {
            delta.otl += 1;
          }
        }
      }
    }
  }

  // Calculate points for each goalie delta
  for (const [, delta] of goalieDeltas) {
    delta.points = calculateGoaliePoints(delta.wins, delta.shutouts, delta.otl);
  }

  return goalieDeltas;
};

/**
 * Merge skater deltas and goalie deltas into a single playerDeltas Map.
 *
 * @param {Map<number, object>} skaterDeltas - From parseLivePlayerStats
 * @param {Map<number, object>} goalieDeltas - From parseLiveGoalieStats
 * @returns {Map<number, object>} - Combined delta map
 */
export const mergeLiveDeltas = (skaterDeltas, goalieDeltas) => {
  const merged = new Map(skaterDeltas);
  for (const [id, delta] of goalieDeltas) {
    merged.set(id, delta);
  }
  return merged;
};

// --- Helpers ---

const getOrCreateDelta = (map, playerId) => {
  if (!map.has(playerId)) {
    map.set(playerId, { goals: 0, assists: 0, otGoals: 0, wins: 0, shutouts: 0, otl: 0, points: 0 });
  }
  return map.get(playerId);
};

const getOrCreateGoalieDelta = (map, playerId) => {
  if (!map.has(playerId)) {
    map.set(playerId, { wins: 0, shutouts: 0, otl: 0, points: 0 });
  }
  return map.get(playerId);
};
