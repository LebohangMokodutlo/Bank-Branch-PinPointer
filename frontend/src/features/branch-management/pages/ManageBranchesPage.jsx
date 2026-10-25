import { useMemo, useState } from 'react';
import { useBranches } from '../../branches/hooks/useBranches';
import BranchDetailsModal from '../components/BranchDetailsModal';
import ToggleActiveConfirmModal from '../components/ToggleActiveConfirmModal';
import CreateBranchModal from '../components/CreateBranchModal';

const PAGE_SIZE = 20;

const ManageBranchesPage = () => {
  const { data: branches, isLoading } = useBranches();
  const [activeOverrides, setActiveOverrides] = useState({});
  const [viewingBranch, setViewingBranch] = useState(null);
  const [togglingBranch, setTogglingBranch] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

  const rows = useMemo(() => {
    return (branches ?? []).map((branch) => ({
      ...branch,
      isActive: activeOverrides[branch.id] ?? branch.isActive,
    }));
  }, [branches, activeOverrides]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return rows;
    }
    return rows.filter(
      (branch) =>
        branch.name.toLowerCase().includes(query) ||
        branch.address.suburb.toLowerCase().includes(query),
    );
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleConfirmToggle = () => {
    setActiveOverrides((prev) => ({
      ...prev,
      [togglingBranch.id]: !togglingBranch.isActive,
    }));
    setTogglingBranch(null);
  };

  if (isLoading) {
    return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Manage Branches</h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <span className="mdi mdi-plus text-base" aria-hidden="true" />
          Create branch
        </button>
      </div>
			<input
				type="text"
				value={searchQuery}
				onChange={(event) => {
					setSearchQuery(event.target.value);
					setPage(0);
				}}
				placeholder="Search by name or suburb..."
				className="mb-4 w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
			/>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Suburb</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((branch) => (
            <tr key={branch.id} className="border-b border-gray-100">
              <td className="py-2 pr-4 font-medium">{branch.name}</td>
              <td className="py-2 pr-4 text-gray-500">{branch.address.suburb}</td>
              <td className="py-2 pr-4">{branch.type}</td>
              <td className="py-2 pr-4">
               <button
                 type="button"
                 onClick={() => setTogglingBranch(branch)}
                 role="switch"
                 aria-checked={branch.isActive}
                 aria-label={`${branch.name} is ${branch.isActive ? 'active' : 'inactive'}`}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                   branch.isActive ? 'bg-green-500' : 'bg-red-500'
                 }`}
               >
                 <span
                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                     branch.isActive ? 'translate-x-6' : 'translate-x-1'
                   }`}
                 />
               </button>
              </td>

              <td className="py-2">
                <button
                  type="button"
                  onClick={() => setViewingBranch(branch)}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <span className="mdi mdi-eye-outline text-base" aria-hidden="true" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
			<div className="mt-4 flex items-center justify-between text-sm text-center">
				<p className="text-gray-500">
   				Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredRows.length)} of {filteredRows.length}
				</p>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setPage((p) => Math.max(0, p - 1))}
						disabled={page === 0}
						className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Previous
					</button>
					<span className="text-gray-500">
						Page {page + 1} of {totalPages}
					</span>
					<button
						type="button"
						onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
						disabled={page >= totalPages - 1}
						className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Next
					</button>
				</div>
			</div>
      {viewingBranch && (
        <BranchDetailsModal branch={viewingBranch} onClose={() => setViewingBranch(null)} />
      )}

      {togglingBranch && (
        <ToggleActiveConfirmModal
          branch={togglingBranch}
          onCancel={() => setTogglingBranch(null)}
          onConfirm={handleConfirmToggle}
        />
      )}

      {isCreateOpen && <CreateBranchModal onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
};

export default ManageBranchesPage;
