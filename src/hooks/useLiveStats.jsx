import { useMemo, useRef } from 'react';
import { parseLivePlayerStats, buildPoolPlayerIds, augmentRoster } from '../utils/parseLiveStats';

/**
 * Serialize a playerDeltas Map into a stable string for comparison.
 * Returns a string like "id:g,a,ot,p|id:g,a,ot,p" sorted by player id.
 */
const serializeDeltas = (deltas) => {
  if (!deltas || deltas.size === 0) return '';
  return [...deltas.entries()]
    .sort(([a], [b]) => a - b)
    .map(([id, d]) => `${id}:${d.goals},${d.assists},${d.otGoals},${d.points}`)
    .join('|');
};

/**
 * Hook that computes live stat deltas from today's NHL scores and returns
 * an augmented copy of the users object with live stats baked into player data.
 *
 * Each augmented player has a `_delta` property: { goals, assists, otGoals, points }
 * that represents today's live contribution (null if no delta).
 *
 * Reference stability: augmentedUsers only changes when the actual delta content
 * changes, NOT on every 60-second poll. This prevents unnecessary re-renders
 * of downstream components (Insights, PlayerDetails, etc.).
 *
 * @param {Array} games - Today's games from useScores
 * @param {object} users - The users object from useUsers ({ rosters, loading, ... })
 * @returns {{ augmentedUsers: object, playerDeltas: Map, hasLiveGames: boolean }}
 */
const useLiveStats = (games, users) => {
  const rosters = users?.rosters;
  const prevDeltaKeyRef = useRef('');
  const prevUsersRef = useRef(null);
  const prevAugmentedRef = useRef(null);

  const poolPlayerIds = useMemo(
    () => buildPoolPlayerIds(rosters),
    [rosters]
  );

  const { playerDeltas, hasLiveGames } = useMemo(
    () => parseLivePlayerStats(games, poolPlayerIds),
    [games, poolPlayerIds]
  );

  const augmentedUsers = useMemo(() => {
    if (!users || !rosters) return users;

    const deltaKey = serializeDeltas(playerDeltas);
    const usersUnchanged = users === prevUsersRef.current;

    // Only reuse cached result if BOTH users and deltas are unchanged
    // (i.e. 60s poll returned same scores, no new roster data)
    if (usersUnchanged && deltaKey === prevDeltaKeyRef.current && prevAugmentedRef.current) {
      return prevAugmentedRef.current;
    }

    prevUsersRef.current = users;

    const result = playerDeltas.size === 0
      ? users
      : {
        ...users,
        rosters: rosters.map(roster => augmentRoster(roster, playerDeltas)),
      };

    prevDeltaKeyRef.current = deltaKey;
    prevAugmentedRef.current = result;
    return result;
  }, [users, rosters, playerDeltas]);

  return { augmentedUsers, playerDeltas, hasLiveGames };
};

export default useLiveStats;
