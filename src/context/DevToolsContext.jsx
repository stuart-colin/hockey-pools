import React, { createContext, useContext, useState, useEffect } from 'react';

const DevToolsContext = createContext();

const DEFAULT_DEV_TOOLS = {
  testEliminatedTeams: false,
  eliminatedTeams: [
    'Toronto Maple Leafs',
    'Edmonton Oilers',
    'Colorado Avalanche',
  ],
  testScoresDate: null,
};

export const DevToolsProvider = ({ children }) => {
  const [devTools, setDevTools] = useState(DEFAULT_DEV_TOOLS);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('devTools');
    if (saved) {
      try {
        setDevTools(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved devTools:', e);
      }
    }
  }, []);

  // Save to localStorage whenever devTools changes
  useEffect(() => {
    localStorage.setItem('devTools', JSON.stringify(devTools));
  }, [devTools]);

  const updateDevTools = (key, value) => {
    setDevTools(prev => ({ ...prev, [key]: value }));
  };

  const resetDevTools = () => {
    setDevTools(DEFAULT_DEV_TOOLS);
    localStorage.removeItem('devTools');
  };

  return (
    <DevToolsContext.Provider value={{ devTools, updateDevTools, resetDevTools }}>
      {children}
    </DevToolsContext.Provider>
  );
};

export const useDevTools = () => {
  const context = useContext(DevToolsContext);
  if (!context) {
    throw new Error('useDevTools must be used within DevToolsProvider');
  }
  return context;
};
