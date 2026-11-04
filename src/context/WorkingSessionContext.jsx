'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createEmptyWorkingSession } from '../data/models';

const WorkingSessionContext = createContext(null);

export function WorkingSessionProvider({ children }) {
  const [session, setSession] = useState(createEmptyWorkingSession);

  const updateSession = useCallback((updates) => {
    setSession((current) => ({ ...current, ...updates }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(createEmptyWorkingSession());
  }, []);

  const value = useMemo(() => ({ session, updateSession, resetSession }), [session, updateSession, resetSession]);

  return (
    <WorkingSessionContext.Provider value={value}>
      {children}
    </WorkingSessionContext.Provider>
  );
}

export function useWorkingSession() {
  const context = useContext(WorkingSessionContext);
  if (!context) {
    throw new Error('useWorkingSession must be used within WorkingSessionProvider');
  }
  return context;
}
