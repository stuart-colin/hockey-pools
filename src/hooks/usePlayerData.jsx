import { useMemo } from 'react';

/**
 * Custom hook to process user rosters and generate a list of unique players
 * with their points and pick counts.
 * Players are already normalized (flat fields) by useUsers.
 * @param {object} users - The user data object containing rosters and loading state.
 * @returns {Array} An array of player objects, sorted by pickCount descending.
 */
const usePlayerData = (users) => {

  const players = useMemo(() => {
    if (!users || users.loading || !users.rosters) {
      return [];
    }

    const playerMap = new Map();

    users.rosters.forEach((user) => {
      const allPlayersInRoster = [
        ...(user.left || []),
        ...(user.center || []),
        ...(user.right || []),
        ...(user.defense || []),
        ...(user.goalie || []),
        ...(user.utility ? [user.utility] : []),
      ].filter(Boolean);

      allPlayersInRoster.forEach((player) => {
        if (!player || !player.name) return;

        if (!playerMap.has(player.name)) {
          const isGoalie = player.position === 'G';
          const pointsPerGame = player.gamesPlayed > 0
            ? (player.points / player.gamesPlayed)
            : 0;

          playerMap.set(player.name, {
            id: player.id,
            headshot: player.headshot,
            name: player.name,
            position: player.position,
            teamLogo: player.teamLogo,
            teamName: player.teamName,
            gamesPlayed: player.gamesPlayed,
            points: player.points,
            stat1: isGoalie ? player.wins : player.goals,
            stat2: isGoalie ? player.shutouts : player.assists,
            stat3: isGoalie ? player.otl : player.otGoals,
            pickCount: 1,
            pointsPerGame,
            isEliminated: player.isEliminated,
          });
        } else {
          playerMap.get(player.name).pickCount += 1;
        }
      });
    });

    const playerList = Array.from(playerMap.values());
    return playerList.sort((a, b) => b.pickCount - a.pickCount);
  }, [users]);

  return players;
};

export default usePlayerData;