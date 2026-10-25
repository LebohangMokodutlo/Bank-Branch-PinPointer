import { useState } from 'react';
import { useBranches } from '../../branches/hooks/useBranches';
import { useSearchDemand } from '../hooks/useSearchDemand';
import { getSearchHistory, clearSearchHistory } from '../../../shared/services/searchHistory';

const SearchAnalyticsPage = () => {
  const { data: branches, isLoading } = useBranches();
  const [searchHistory, setSearchHistory] = useState(() => getSearchHistory());

  const demand = useSearchDemand(searchHistory, branches ?? []);

  const handleClear = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  if (isLoading) {
    return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Search Analytics</h1>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light"
        >
          Clear history
        </button>
      </div>

      {demand.length === 0 ? (
        <p className="text-sm text-gray-500">
          No searches recorded yet. Search a place on the Branch Locator page, then come back here.
        </p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Province</th>
              <th className="py-2 pr-4">Times searched</th>
              <th className="py-2 pr-4">Nearby branches (20km)</th>
              <th className="py-2">Needs more branches?</th>
            </tr>
          </thead>
          <tbody>
            {demand.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">{entry.name}</td>
                <td className="py-2 pr-4 text-gray-500">{entry.province}</td>
                <td className="py-2 pr-4">{entry.count}</td>
                <td className="py-2 pr-4">{entry.nearbyBranchCount}</td>
                <td className="py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.needsMoreBranches ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {entry.needsMoreBranches ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchAnalyticsPage;
