import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './shared/components/NavBar';
import { AdminModeProvider } from './shared/context/AdminModeContext';
import RequireAdmin from './shared/components/RequireAdmin';
import BranchesPage from './features/branches/pages/BranchesPage';
import SearchAnalyticsPage from './features/search-analytics/pages/SearchAnalyticsPage';
import ManageBranchesPage from './features/branch-management/pages/ManageBranchesPage';

const App = () => {
  return (
    <AdminModeProvider>
      <BrowserRouter>
        <div className="flex h-screen flex-col">
          <NavBar />
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<BranchesPage />} />
              <Route
                path="/search-analytics"
                element={
                  <RequireAdmin>
                    <SearchAnalyticsPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/manage-branches"
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
    </AdminModeProvider>
  );
};

export default App;
