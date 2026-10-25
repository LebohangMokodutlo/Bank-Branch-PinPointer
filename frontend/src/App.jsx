import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './shared/components/NavBar';
import { AdminModeProvider } from './shared/context/AdminModeContext';
import { BranchOverridesProvider } from './shared/context/BranchOverridesContext';
import RequireAdmin from './shared/components/RequireAdmin';
import BranchesPage from './features/branches/pages/BranchesPage';
import SearchAnalyticsPage from './features/search-analytics/pages/SearchAnalyticsPage';
import ManageBranchesPage from './features/branch-management/pages/ManageBranchesPage';
import { routes } from './constants';

const App = () => {
  return (
    <AdminModeProvider>
      <BranchOverridesProvider>
        <BrowserRouter>
          <div className="flex h-screen flex-col">
            <NavBar />
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path={routes.home} element={<BranchesPage />} />
                <Route
                  path={routes.searchAnalytics}
                  element={
                    <RequireAdmin>
                      <SearchAnalyticsPage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path={routes.manageBranches}
                  element={
                    <RequireAdmin>
                      <ManageBranchesPage />
                    </RequireAdmin>
                  }
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </BranchOverridesProvider>
    </AdminModeProvider>
  );
};

export default App;
