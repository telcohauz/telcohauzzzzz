import React, { createContext, useContext, useState, useEffect } from 'react';
import { TelcoPlan } from '../../data/telcoData.ts';

interface CompareContextType {
  compareList: TelcoPlan[];
  addToCompare: (plan: TelcoPlan) => boolean; // returns false if max reached
  removeFromCompare: (planId: string) => void;
  clearCompare: () => void;
  isInCompare: (planId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'telcohauz_compare_list';

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<TelcoPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.error('Failed to save compare items', e);
    }
  }, [compareList]);

  const addToCompare = (plan: TelcoPlan) => {
    if (compareList.some(p => p.id === plan.id)) {
      return true;
    }
    if (compareList.length >= 4) {
      return false; // max 4 plans
    }
    setCompareList(prev => [...prev, plan]);
    return true;
  };

  const removeFromCompare = (planId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== planId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (planId: string) => {
    return compareList.some(p => p.id === planId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
