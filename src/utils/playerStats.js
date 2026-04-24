/**
 * Shared helpers for working with normalized player objects.
 *
 * Both roster players and unselected players share the same flat stat shape:
 *   - All players carry both skater fields (`goals`, `assists`, `otGoals`) and
 *     goalie fields (`wins`, `shutouts`, `otl`) on the object. Fields not
 *     applicable to a player's position default to 0.
 *   - All players carry an aggregated `points` value.
 *
 * Use these helpers anywhere you need to apply live deltas or render a
 * three-stat line, so the position-vs-field-name mapping lives in one place.
 */

/**
 * Apply a live stat delta to a normalized player. Returns a new player object
 * with updated counting stats, `points`, and a `_delta` property.
 *
 * @param {Object} player - Normalized player ({ position, goals, ... } shape)
 * @param {Object} delta  - Live delta from `parseLivePlayerStats` /
 *                          `parseLiveGoalieStats` (uses skater/goalie field names)
 * @returns {Object} - New augmented player; `_delta` is `null` if no delta was applied
 */
export const applyDeltaToPlayer = (player, delta) => {
  if (!player) return player;
  if (!delta) return { ...player, _delta: null };

  const isGoalie = player.position === 'G';
  if (isGoalie) {
    return {
      ...player,
      wins: (player.wins || 0) + (delta.wins || 0),
      shutouts: (player.shutouts || 0) + (delta.shutouts || 0),
      otl: (player.otl || 0) + (delta.otl || 0),
      points: (player.points || 0) + (delta.points || 0),
      _delta: { ...delta },
    };
  }
  return {
    ...player,
    goals: (player.goals || 0) + (delta.goals || 0),
    assists: (player.assists || 0) + (delta.assists || 0),
    otGoals: (player.otGoals || 0) + (delta.otGoals || 0),
    points: (player.points || 0) + (delta.points || 0),
    _delta: { ...delta },
  };
};

/**
 * Return the three counting-stat values + their labels for a normalized player.
 * Useful for rendering generic "three column" tables without scattering
 * position checks across the UI.
 *
 * @param {Object} player - Normalized player
 * @returns {{ values: [number, number, number], labels: [string, string, string] }}
 */
export const getStatTriple = (player) => {
  if (!player) return { values: [0, 0, 0], labels: ['', '', ''] };
  const isGoalie = player.position === 'G';
  if (isGoalie) {
    return {
      values: [player.wins || 0, player.shutouts || 0, player.otl || 0],
      labels: ['W', 'SO', 'OTL'],
    };
  }
  return {
    values: [player.goals || 0, player.assists || 0, player.otGoals || 0],
    labels: ['G', 'A', 'OTG'],
  };
};

/**
 * Format a normalized player's three counting stats as a single ` — A B C` line
 * (e.g. `3 G | 5 A | 1 OTG`). Returns an empty string when the player is missing.
 */
export const formatStatTripleLine = (player) => {
  if (!player) return '';
  const { values, labels } = getStatTriple(player);
  return `${values[0]} ${labels[0]} | ${values[1]} ${labels[1]} | ${values[2]} ${labels[2]}`;
};
