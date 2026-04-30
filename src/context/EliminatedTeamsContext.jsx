import React, { createContext, useContext, useMemo } from 'react';
import useEliminatedTeams from '../hooks/useEliminatedTeams';
import { useDevTools } from './DevToolsContext';

const EliminatedTeamsContext = createContext({
  eliminatedTeams: [],
  eliminationsByRound: {},
  completedRounds: [],
  atRiskTeams: [],
  loading: true,
  error: null,
});

export const useEliminatedTeamsContext = () => useContext(EliminatedTeamsContext);

export const EliminatedTeamsProvider = ({ season, children }) => {
  const {
    eliminatedTeams,
    eliminationsByRound,
    completedRounds,
    atRiskTeams,
    loading,
    error,
  } = useEliminatedTeams(season);
  const { devTools } = useDevTools();

  const mergedTeams = useMemo(() => {
    if (!devTools.testEliminatedTeams) return eliminatedTeams;
    return [...new Set([...eliminatedTeams, ...devTools.eliminatedTeams])];
  }, [eliminatedTeams, devTools]);

  return (
    <EliminatedTeamsContext.Provider
      value={{
        eliminatedTeams: mergedTeams,
        eliminationsByRound: eliminationsByRound || {},
        completedRounds: completedRounds || [],
        atRiskTeams: atRiskTeams || [],
        loading,
        error,
      }}
    >
      {children}
    </EliminatedTeamsContext.Provider>
  );
};