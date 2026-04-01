import { calculateSkaterPoints, calculateGoaliePoints } from './points';

/**
 * Normalize a raw player object from the API into a flat shape.
 * Eliminates the deep `stats.featuredStats.playoffs.subSeason` nesting.
 *
 * @param {Object} player - Raw player object from roster API
 * @param {string[]} eliminatedTeams - List of eliminated team names
 * @returns {Object} Flat player object
 */
const normalizePlayer = (player, eliminatedTeams = []) => {
  if (!player) return null;

  const sub = player.stats?.featuredStats?.playoffs?.subSeason;
  const isGoalie = player.position === 'G';
  const teamName = player.stats?.teamName || '';

  const goals = sub?.goals || 0;
  const assists = sub?.assists || 0;
  const otGoals = sub?.otGoals || 0;
  const wins = sub?.wins || 0;
  const shutouts = sub?.shutouts || 0;
  const otl = player.stats?.otl || 0;
  const gamesPlayed = sub?.gamesPlayed || 0;

  const points = isGoalie
    ? calculateGoaliePoints(wins, shutouts, otl)
    : calculateSkaterPoints(goals, assists, otGoals);

  return {
    // Identity
    id: player.nhl_id,
    name: player.name,
    position: player.position,

    // Team
    teamName,
    teamLogo: player.stats?.teamLogo || '',
    headshot: player.headshot || '',
    sweaterNumber: player.sweaterNumber || '',

    // Stats (flat)
    goals,
    assists,
    otGoals,
    wins,
    shutouts,
    otl,
    gamesPlayed,
    points,

    // Derived
    isEliminated: eliminatedTeams.includes(teamName),
  };
};

export default normalizePlayer;
