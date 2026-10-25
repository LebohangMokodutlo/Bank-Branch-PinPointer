import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storageKeys } from '../../constants';

const STORAGE_KEY = storageKeys.branchActiveOverrides;

const BranchOverridesContext = createContext(null);

export const BranchOverridesProvider = ({ children }) => {
  const [overrides, setOverrides] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const setBranchActive = (branchId, isActive) => {
    setOverrides((prev) => ({ ...prev, [branchId]: isActive }));
  };

  const value = useMemo(() => ({ overrides, setBranchActive }), [overrides]);

  return <BranchOverridesContext.Provider value={value}>{children}</BranchOverridesContext.Provider>;
};

export const useBranchOverrides = () => {
  const context = useContext(BranchOverridesContext);
  if (context === null) {
    throw new Error('useBranchOverrides must be used within a BranchOverridesProvider');
  }
  return context;
};
