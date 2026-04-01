import { useState, useEffect, useMemo } from 'react';
import { calculateSkaterPoints, calculateGoaliePoints } from '../utils/points';

const STATS_PROXY_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/nhl/stats`;

const useUnselectedPlayers = (selectedPlayers, season, eliminatedTeams) => {
  const [unselectedPlayers, setUnselectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMap, setTeamMap] = useState(null);

  // Stabilize: only recompute when the set of IDs changes, not when stats are augmented
  const selectedIdKey = selectedPlayers.map(p => p.id ? p.id.toString() : p.name).sort().join(',');
  const selectedPlayerIds = useMemo(
    () => new Set(selectedIdKey.split(',')),
    [selectedIdKey]
  );

  const seasonId = useMemo(() => {
    if (!season) return null;
    const currentSeason = parseInt(season);
    // For the 2024 playoffs, season is "2024", seasonId is "20232024"
    return `${currentSeason - 1}${currentSeason}`;
  }, [season]);

  useEffect(() => {
    if (!seasonId) return;

    let cancelled = false;

    const fetchTeamData = async () => {
      try {
        // Fetch team data for mapping abbreviations to full names
        const teamUrl = new URL(`${STATS_PROXY_API_ENDPOINT}/team`);

        const response = await fetch(teamUrl.toString());
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for team data`);
        }
        const teamData = await response.json();
        if (cancelled) return;
        const teams = teamData.data;
        const newTeamMap = new Map();
        teams.forEach(team => {
          newTeamMap.set(team.triCode, team.fullName);
        });
        setTeamMap(newTeamMap);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to fetch team data:', err);
        setError(err); // Set error if team data fails, as it's crucial for skaters
      }
    };
    fetchTeamData();
    return () => {
      cancelled = true;
    };
  }, [seasonId]);

  useEffect(() => {
    let cancelled = false;

    if (!seasonId || !eliminatedTeams || !teamMap) {
      // Wait for seasonId, eliminatedTeams, and teamMap to be available
      if (seasonId && eliminatedTeams && !teamMap && !error) { // teamMap is loading or failed
        setLoading(true); // Keep loading if teamMap isn't ready and no error yet
      } else {
        setUnselectedPlayers([]);
        setLoading(false);
      }
      return () => {
        cancelled = true;
      };
    }

    const fetchUnselectedPlayersData = async () => {
      setLoading(true);
      setError(null); // Reset error before new fetch
      try {
        let allApiPlayers = [];

        // Build URLs for parallel fetching
        const goalieUrl = new URL(`${STATS_PROXY_API_ENDPOINT}/goalie/summary`);
        goalieUrl.searchParams.append('limit', '-1');
        goalieUrl.searchParams.append('cayenneExp', `seasonId=${seasonId} and gameTypeId=3`);

        const skaterUrl = new URL(`${STATS_PROXY_API_ENDPOINT}/skater/summary`);
        skaterUrl.searchParams.append('limit', '-1');
        skaterUrl.searchParams.append('cayenneExp', `seasonId=${seasonId} and gameTypeId=3`);

        // Fetch both goalies and skaters in parallel
        const [goalieResponse, skaterResponse] = await Promise.all([
          fetch(goalieUrl.toString()),
          fetch(skaterUrl.toString())
        ]);

        if (cancelled) return;

        // Process goalies
        if (goalieResponse.ok) {
          const goalieData = await goalieResponse.json();
          if (cancelled) return;
          if (goalieData.data) {
            const processedGoalies = goalieData.data
              .filter(apiGoalie => !selectedPlayerIds.has(apiGoalie.playerId.toString()))
              .map(apiGoalie => {
                const points = calculateGoaliePoints(apiGoalie.wins, apiGoalie.shutouts, apiGoalie.otLosses);
                const gamesPlayed = apiGoalie.gamesPlayed || 0;
                const pointsPerGame = gamesPlayed > 0 ? points / gamesPlayed : 0;
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
        } else {
          console.warn(`HTTP error! status: ${goalieResponse.status} for goalie data. Proceeding without unselected goalies.`);
        }

        // Process skaters
        if (skaterResponse.ok) {
          const skaterData = await skaterResponse.json();
          if (cancelled) return;
          if (skaterData.data) {
            const processedSkaters = skaterData.data
              .filter(apiSkater => !selectedPlayerIds.has(apiSkater.playerId.toString()))
              .map(apiSkater => {
                const teamAbbrev = apiSkater.teamAbbrevs ? apiSkater.teamAbbrevs.split(',').pop().trim() : 'UNKNOWN';
                const points = calculateSkaterPoints(apiSkater.goals, apiSkater.assists, apiSkater.otGoals);
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
        } else {
          console.warn(`HTTP error! status: ${skaterResponse.status} for skater data. Proceeding without unselected skaters.`);
        }

        if (cancelled) return;
        setUnselectedPlayers(allApiPlayers);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to fetch unselected NHL players:', err);
        setError(err);
        setUnselectedPlayers([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUnselectedPlayersData();
    return () => {
      cancelled = true;
    };
  }, [seasonId, selectedPlayerIds, eliminatedTeams, teamMap, error]); // Add error to dependency to allow retry if teamMap failed

  return { unselectedPlayers, loadingUnselected: loading, errorUnselected: error };
};

export default useUnselectedPlayers;