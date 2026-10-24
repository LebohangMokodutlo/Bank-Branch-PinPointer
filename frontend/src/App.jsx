import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './shared/components/NavBar';
import BranchesPage from './features/branches/pages/BranchesPage';
import SearchAnalyticsPage from './features/search-analytics/pages/SearchAnalyticsPage';
import ManageBranchesPage from './features/branch-management/pages/ManageBranchesPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col">
        <NavBar />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<BranchesPage />} />
            <Route path="/search-analytics" element={<SearchAnalyticsPage />} />
            <Route path="/manage-branches" element={<ManageBranchesPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
