import React, { createContext, useContext, useMemo } from 'react';
import useEliminatedTeams from '../hooks/useEliminatedTeams';
import { DEV_TEST_ELIMINATED, DEV_ELIMINATED_TEAMS } from '../constants/devConfig';

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
    return [...new Set([...eliminatedTeams, ...DEV_ELIMINATED_TEAMS])];
  }, [eliminatedTeams]);

  return (
    <EliminatedTeamsContext.Provider value={{ eliminatedTeams: mergedTeams, loading, error }}>
      {children}
    </EliminatedTeamsContext.Provider>
  );
};