"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Stats {
  totalSessions: number;
  totalQuestions: number;
  documentsProcessed: number;
  recentSessions: number;
  recentQuestions: number;
  avgQuestionsPerSession: number;
}

interface StatsContextType {
  stats: Stats;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalQuestions: 0,
    documentsProcessed: 0,
    recentSessions: 0,
    recentQuestions: 0,
    avgQuestionsPerSession: 0,
  });
  const [loading, setLoading] = useState(false);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
