import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bank-branch-pinpointer:isAdmin';

const AdminModeContext = createContext(null);

export const AdminModeProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isAdmin));
  }, [isAdmin]);

  const value = useMemo(() => ({ isAdmin, setIsAdmin }), [isAdmin]);

  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>;
};

export const useAdminMode = () => {
  const context = useContext(AdminModeContext);
  if (context === null) {
    throw new Error('useAdminMode must be used within an AdminModeProvider');
  }
  return context;
};
