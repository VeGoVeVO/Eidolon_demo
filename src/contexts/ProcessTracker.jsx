import { createContext, useContext } from 'react';

const ProcessTrackerContext = createContext();

export const useProcessTracker = () => {
  const context = useContext(ProcessTrackerContext);
  if (!context) {
    throw new Error('useProcessTracker must be used within ProcessTrackerProvider');
  }
  return context;
};

export const ProcessTrackerProvider = ({ children }) => {
  // ProcessTracker is now a minimal context provider
  // No process tracking, no cancellation - processes run to completion in background
  // This context is kept for backward compatibility but does nothing

  const value = {};

  return (
    <ProcessTrackerContext.Provider value={value}>
      {children}
    </ProcessTrackerContext.Provider>
  );
};

