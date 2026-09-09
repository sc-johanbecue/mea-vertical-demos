'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type SolutionTabsContextValue = {
  activeId: string | null;
  setActiveId: (id: string) => void;
  register: (id: string) => void;
};

const SolutionTabsContext = createContext<SolutionTabsContextValue | null>(null);

export function SolutionTabsProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const register = useCallback((id: string) => {
    setActiveId((prev) => prev ?? id);
  }, []);

  const value = useMemo(
    () => ({ activeId, setActiveId, register }),
    [activeId, register],
  );

  return <SolutionTabsContext.Provider value={value}>{children}</SolutionTabsContext.Provider>;
}

export function useSolutionTabs(): SolutionTabsContextValue | null {
  return useContext(SolutionTabsContext);
}
