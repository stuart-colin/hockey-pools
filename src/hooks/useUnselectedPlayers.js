import { useState, useEffect, useMemo } from 'react';

const NHL_API_BASE_URL = 'https://cs-cors-anywhere-b93c6060f143.herokuapp.com/https://api.nhle.com/stats/rest/en';

const useUnselectedPlayers = (selectedPlayers, season, eliminatedTeams) => {
  const [unselectedPlayers, setUnselectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMap, setTeamMap] = useState(null);

  const seasonId = useMemo(() => {
    if (!season) return null;
    const currentYear = parseInt(season);
    // For the 2024 playoffs, season is "2024", seasonId is "20232024"
    return `${currentYear - 1}${currentYear}`;
  }, [season]);

  useEffect(() => {
    if (!seasonId) return;

    const fetchTeamData = async () => {
      try {
        // Fetch team data for mapping abbreviations to full names
        const teamUrl = new URL(`${NHL_API_BASE_URL}/team`);

        const response = await fetch(teamUrl.toString());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for team data`);
        }
        const teamData = await response.json();
        const teams = teamData.data;
        const newTeamMap = new Map();
        teams.forEach(team => {
          newTeamMap.set(team.triCode, team.fullName);
        });
        setTeamMap(newTeamMap);
      } catch (err) {
        console.error('Failed to fetch team data:', err);
        setError(err); // Set error if team data fails, as it's crucial for skaters
      }
    };
    fetchTeamData();
  }, [seasonId]);

  useEffect(() => {
    if (!seasonId || !eliminatedTeams || !teamMap) {
      // Wait for seasonId, eliminatedTeams, and teamMap to be available
      if (seasonId && eliminatedTeams && !teamMap && !error) { // teamMap is loading or failed
        setLoading(true); // Keep loading if teamMap isn't ready and no error yet
      } else {
        setUnselectedPlayers([]);
        setLoading(false);
      }
      return;
    }

    const fetchUnselectedPlayersData = async () => {
      setLoading(true);
      setError(null); // Reset error before new fetch
      try {
        const selectedPlayerIds = new Set(selectedPlayers.map(p => p.id ? p.id.toString() : p.name)); // Ensure string IDs
        let allApiPlayers = [];

        // Fetch Goalies
        const goalieUrl = new URL(`${NHL_API_BASE_URL}/goalie/summary`);
        goalieUrl.searchParams.append('limit', '-1');
        goalieUrl.searchParams.append('cayenneExp', `seasonId=${seasonId} and gameTypeId=3`);

        const goalieResponse = await fetch(goalieUrl.toString());
        if (!goalieResponse.ok) {
          console.warn(`HTTP error! status: ${goalieResponse.status} for goalie data. Proceeding without unselected goalies.`);
        } else {
          const goalieData = await goalieResponse.json();
          if (goalieData.data) {
            const processedGoalies = goalieData.data
              .filter(apiGoalie => !selectedPlayerIds.has(apiGoalie.playerId.toString()))
              .map(apiGoalie => {
                const points = (apiGoalie.wins * 2) + (apiGoalie.shutouts * 2) + (apiGoalie.otLosses || 0);
                const gamesPlayed = apiGoalie.gamesPlayed || 0;
                const pointsPerGame = gamesPlayed > 0 ? points / gamesPlayed : 0;

                // Process teamAbbrevs for goalies, similar to skaters, to get the current team
                const currentGoalieTeamAbbrev = apiGoalie.teamAbbrevs ? apiGoalie.teamAbbrevs.split(',').pop().trim() : 'UNKNOWN';

                const headshotUrl = `https://assets.nhle.com/mugs/nhl/${seasonId}/${currentGoalieTeamAbbrev}/${apiGoalie.playerId}.png`;
                const teamFullName = apiGoalie.teamFullName || teamMap.get(currentGoalieTeamAbbrev) || currentGoalieTeamAbbrev;

                return {
                  id: apiGoalie.playerId.toString(),
                  headshot: headshotUrl,
                  name: apiGoalie.goalieFullName,
                  position: 'G',
                  teamLogo: `https://assets.nhle.com/logos/nhl/svg/${currentGoalieTeamAbbrev}_light.svg`,
                  teamName: teamFullName,
                  gamesPlayed: gamesPlayed,
                  points: points,
                  stat1: apiGoalie.wins || 0,
                  stat2: apiGoalie.shutouts || 0,
                  stat3: apiGoalie.otLosses || 0,
                  pickCount: 0,
                  pointsPerGame: pointsPerGame,
                  isEliminated: eliminatedTeams.includes(teamFullName),
                  isUnselected: true,
                };
              });
            allApiPlayers = allApiPlayers.concat(processedGoalies);
          }
        }

        // Fetch Skaters
        const skaterUrl = new URL(`${NHL_API_BASE_URL}/skater/summary`);
        skaterUrl.searchParams.append('limit', '-1');
        skaterUrl.searchParams.append('cayenneExp', `seasonId=${seasonId} and gameTypeId=3`);

        const skaterResponse = await fetch(skaterUrl.toString());
        if (!skaterResponse.ok) {
          console.warn(`HTTP error! status: ${skaterResponse.status} for skater data. Proceeding without unselected skaters.`);
        } else {
          const skaterData = await skaterResponse.json();
          if (skaterData.data) {
            const processedSkaters = skaterData.data
              .filter(apiSkater => !selectedPlayerIds.has(apiSkater.playerId.toString()))
              .map(apiSkater => {
                // teamAbbrevs can be comma-separated if traded, take the last one for playoff context.
                const teamAbbrev = apiSkater.teamAbbrevs ? apiSkater.teamAbbrevs.split(',').pop().trim() : 'UNKNOWN';
                const points = (apiSkater.goals) + (apiSkater.assists) + (apiSkater.otGoals);
                const gamesPlayed = apiSkater.gamesPlayed;
                const pointsPerGame = gamesPlayed > 0 ? (points) / gamesPlayed : 0;
                const headshotUrl = `https://assets.nhle.com/mugs/nhl/${seasonId}/${teamAbbrev}/${apiSkater.playerId}.png`;
                const teamFullName = teamMap.get(teamAbbrev) || teamAbbrev;

                return {
                  id: apiSkater.playerId.toString(),
                  headshot: headshotUrl,
                  name: apiSkater.skaterFullName,
                  position: apiSkater.positionCode,
                  teamLogo: `https://assets.nhle.com/logos/nhl/svg/${teamAbbrev}_light.svg`,
                  teamName: teamFullName,
                  gamesPlayed: gamesPlayed,
                  points: points,
                  stat1: apiSkater.goals,
                  stat2: apiSkater.assists,
                  stat3: apiSkater.otGoals,
                  pickCount: 0,
                  pointsPerGame: pointsPerGame,
                  isEliminated: eliminatedTeams.includes(teamFullName),
                  isUnselected: true,
                };
              });
            allApiPlayers = allApiPlayers.concat(processedSkaters);
          }
        }

        setUnselectedPlayers(allApiPlayers);
      } catch (err) {
        console.error('Failed to fetch unselected NHL players:', err);
        setError(err);
        setUnselectedPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnselectedPlayersData();
  }, [seasonId, selectedPlayers, eliminatedTeams, teamMap, error]); // Add error to dependency to allow retry if teamMap failed

  return { unselectedPlayers, loadingUnselected: loading, errorUnselected: error };
};

export default useUnselectedPlayers;