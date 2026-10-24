import { useState } from 'react';
import { useBranches } from '../hooks/useBranches';
import { useNearestBranch } from '../hooks/useNearestBranch';
import LeafletMap from '../components/LeafletMap';
import PlacesSearch from '../components/PlacesSearch';
import LocateMeButton from '../components/LocateMeButton';

const BranchesPage = () => {
  const { data: branches, isLoading, error } = useBranches();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const nearestBranch = useNearestBranch(userLocation, branches);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Couldn&apos;t load branches: {error.message}</p>;
  if (!branches?.length) return <p>No branches found.</p>;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">Bank Branch Locator</h1>
        <PlacesSearch onSelectPlace={setSelectedPlace} />
        <LocateMeButton onLocate={setUserLocation} />
        {nearestBranch && (
          <p className="text-sm text-gray-600">
            Nearest: {nearestBranch.branch.name} ({nearestBranch.distanceKm.toFixed(1)} km)
          </p>
        )}
      </div>

      <main className="relative flex-1">
        <LeafletMap branches={branches} selectedPlace={selectedPlace} nearestBranch={nearestBranch} />
      </main>
    </div>
  );
};

export default BranchesPage;
