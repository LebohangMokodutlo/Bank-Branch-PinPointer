import { useBranches } from '../hooks/useBranches';
import LeafletMap from '../components/LeafletMap';

const BranchesPage = () => {
  const {
    data: branches,
    error,
    isLoading,
  } = useBranches();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Couldn&apos;t load branches: {error.message}</p>;
  if (!branches?.length) return <p>No branches found.</p>;

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">Bank Branch Locator</h1>
      </header>

      {/* <main className="relative flex-1"> */}
        <LeafletMap branches={branches} />
      {/* </main> */}
    </div>
  );
};

export default BranchesPage;
