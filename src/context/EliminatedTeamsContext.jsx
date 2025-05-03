import React, { createContext, useContext } from 'react';
import useEliminatedTeams from '../hooks/useEliminatedTeams'; // Adjust path if needed

// 1. Create the context
const EliminatedTeamsContext = createContext({
  eliminatedTeams: [],
  loading: true,
  error: null,
});

// 2. Create a custom hook for easy consumption
export const useEliminatedTeamsContext = () => useContext(EliminatedTeamsContext);

// 3. Create the Provider component
export const EliminatedTeamsProvider = ({ season, children }) => {
  const { eliminatedTeams, loading, error } = useEliminatedTeams(season);

  return (
    <EliminatedTeamsContext.Provider value={{ eliminatedTeams, loading, error }}>
      {children}
    </EliminatedTeamsContext.Provider>
  );
};