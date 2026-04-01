import { calculateSkaterPoints } from './points';
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
    return {
      ...player,
      goals: (player.goals || 0) + delta.goals,
      assists: (player.assists || 0) + delta.assists,
      otGoals: (player.otGoals || 0) + delta.otGoals,
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

// --- Helpers ---

const getOrCreateDelta = (map, playerId) => {
  if (!map.has(playerId)) {
    map.set(playerId, { goals: 0, assists: 0, otGoals: 0, points: 0 });
  }
  return map.get(playerId);
};
