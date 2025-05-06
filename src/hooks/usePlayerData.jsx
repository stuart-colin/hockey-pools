import { useMemo } from 'react';

/**
 * Custom hook to process user rosters and generate a list of unique players
 * with their points and pick counts.
 * @param {object} users - The user data object containing rosters and loading state.
 * @param {string[]} eliminatedTeams - An array of eliminated team names.
 * @param {boolean} eliminatedLoading - Loading state for eliminated teams.
 * @returns {Array} An array of player objects, sorted by pickCount descending.
 */
const usePlayerData = (users, eliminatedTeams, eliminatedLoading) => {

  const players = useMemo(() => {
    if (!users || users.loading || !users.rosters || eliminatedLoading) {
      return [];
    }

    const playerMap = new Map();

    users.rosters.forEach((user) => {
      // Combine all players from different positions into one array
      // Access position arrays directly on 'user', not 'user.roster'
      const allPlayersInRoster = [
        ...(user.left || []),
        ...(user.center || []),
        ...(user.right || []),
        ...(user.defense || []),
        ...(user.goalie || []),
        ...(user.utility ? [user.utility] : []), // Handle potential missing utility
      ].filter(Boolean); // Filter out any null/undefined entries

      allPlayersInRoster.forEach((player) => {
        if (!player || !player.name) return;

        if (!playerMap.has(player.name)) {
          const isGoalie = player.position === 'G';
          const otl = (player.stats && player.stats.otl != null) ? player.stats.otl : 0;
          const stats = player.stats && player.stats.featuredStats && player.stats.featuredStats.playoffs && player.stats.featuredStats.playoffs.subSeason;

          let points = 0, stat1 = 0, stat2 = 0, stat3 = 0, gamesPlayed = 0;

          if (isGoalie) {
            if (stats) {
              points = (stats.wins * 2) + (stats.shutouts * 2) + otl;
              stat1 = stats.wins;
              stat2 = stats.shutouts;
            }
            stat3 = otl; // OTL is independent of other stats existing
          } else {
            if (stats) {
              points = stats.goals + stats.assists + stats.otGoals;
              stat1 = stats.goals;
              stat2 = stats.assists;
              stat3 = stats.otGoals;
            }
          }

          if (stats && stats.gamesPlayed && stats.gamesPlayed >= 0) {
            gamesPlayed = stats.gamesPlayed;
          }

          const pointsPerGame = gamesPlayed > 0 ? (points / gamesPlayed) : 0;

          playerMap.set(player.name, {
            id: player.playerId || player.name,
            headshot: player.headshot,
            name: player.name,
            position: player.position,
            teamLogo: player.stats && player.stats.teamLogo, // Ensure teamLogo is correctly accessed
            teamName: player.stats && player.stats.teamName,
            gamesPlayed: gamesPlayed,
            points: points,
            stat1: stat1,
            stat2: stat2,
            stat3: stat3,
            pickCount: 1,
            pointsPerGame: pointsPerGame, // Add pointsPerGame here
            isEliminated: eliminatedTeams.includes(player.stats && player.stats.teamName), // Calculate directly
          });
        } else {
          playerMap.get(player.name).pickCount += 1;
        }
      });
    });

    // Convert map values to an array and sort
    const playerList = Array.from(playerMap.values());
    return playerList.sort((a, b) => b.pickCount - a.pickCount); // Sort by pick count descending
  }, [users, eliminatedTeams, eliminatedLoading]); // Update dependencies

  return players;
};

export default usePlayerData;