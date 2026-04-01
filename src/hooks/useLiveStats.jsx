import { useMemo, useRef } from 'react';
import { parseLivePlayerStats, parseLiveGoalieStats, mergeLiveDeltas, buildPoolPlayerIds, augmentRoster } from '../utils/parseLiveStats';

/**
 * Serialize a playerDeltas Map into a stable string for comparison.
 * Returns a string like "id:g,a,ot,w,so,otl,p|id:g,a,ot,w,so,otl,p" sorted by player id.
 */
const serializeDeltas = (deltas) => {
  if (!deltas || deltas.size === 0) return '';
  return [...deltas.entries()]
    .sort(([a], [b]) => a - b)
    .map(([id, d]) => `${id}:${d.goals || 0},${d.assists || 0},${d.otGoals || 0},${d.wins || 0},${d.shutouts || 0},${d.otl || 0},${d.points}`)
    .join('|');
};

/**
 * Hook that computes live stat deltas from today's NHL scores and boxscores,
 * and returns an augmented copy of the users object with live stats baked in.
 *
 * Skater stats (goals, assists, OT goals) come from the scores endpoint.
 * Goalie stats (wins, shutouts, OTL) come from the boxscore endpoint.
 *
 * Each augmented player has a `_delta` property with today's live contribution.
 *
 * Reference stability: augmentedUsers only changes when the actual delta content
 * changes, NOT on every 60-second poll.
 *
 * @param {Array} games - Today's games from useScores
 * @param {Array} boxscores - Boxscore data from useBoxscores
 * @param {object} users - The users object from useUsers ({ rosters, loading, ... })
 * @returns {{ augmentedUsers: object, playerDeltas: Map, hasLiveGames: boolean }}
 */
const useLiveStats = (games, boxscores, users) => {
  const rosters = users?.rosters;
  const prevDeltaKeyRef = useRef('');
  const prevUsersRef = useRef(null);
  const prevAugmentedRef = useRef(null);

  const poolPlayerIds = useMemo(
    () => buildPoolPlayerIds(rosters),
    [rosters]
  );

  const { playerDeltas: skaterDeltas, hasLiveGames } = useMemo(
    () => parseLivePlayerStats(games, poolPlayerIds),
    [games, poolPlayerIds]
  );

  const goalieDeltas = useMemo(
    () => parseLiveGoalieStats(boxscores, poolPlayerIds),
    [boxscores, poolPlayerIds]
  );

  const playerDeltas = useMemo(
    () => mergeLiveDeltas(skaterDeltas, goalieDeltas),
    [skaterDeltas, goalieDeltas]
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
