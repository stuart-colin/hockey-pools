import React, { createContext, useContext, useMemo } from 'react';
import useEliminatedTeams from '../hooks/useEliminatedTeams';

// DEV TESTING: Set to true + add team names to test elimination visuals before playoffs start
const DEV_TEST_ELIMINATED = false;
const DEV_TEST_TEAMS = ['Toronto Maple Leafs', 'Edmonton Oilers'];

const EliminatedTeamsContext = createContext({
  eliminatedTeams: [],
  loading: true,
  error: null,
});

export const useEliminatedTeamsContext = () => useContext(EliminatedTeamsContext);

export const EliminatedTeamsProvider = ({ season, children }) => {
  const { eliminatedTeams, loading, error } = useEliminatedTeams(season);

  const mergedTeams = useMemo(() => {
    if (!DEV_TEST_ELIMINATED) return eliminatedTeams;
    return [...new Set([...eliminatedTeams, ...DEV_TEST_TEAMS])];
  }, [eliminatedTeams]);

  return (
    <EliminatedTeamsContext.Provider value={{ eliminatedTeams: mergedTeams, loading, error }}>
      {children}
    </EliminatedTeamsContext.Provider>
  );
};