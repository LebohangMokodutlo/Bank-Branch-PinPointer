import { useState } from 'react';
import LeafletMap from '../components/LeafletMap';
import PlaceSearch from '../components/PlacesSearch';
import LocateMeButton from '../components/LocateMeButton';
import BranchTypeFilter from '../components/BranchTypeFilter';
import MapLegend from '../components/MapLegend';
import { useBranches } from '../hooks/useBranches';
import { useNearestBranch } from '../hooks/useNearestBranch';
import { useFilteredBranches } from '../hooks/useFilteredBranches';

const BranchesPage = () => {
  const { data: branches, isLoading, error } = useBranches();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const { typeFiltered, visibleBranches } = useFilteredBranches(branches, { selectedPlace, typeFilter });
  const nearestBranch = useNearestBranch(userLocation, typeFiltered);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Couldn&apos;t load branches: {error.message}</p>;
  if (!branches?.length) return <p>No branches found.</p>;


  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">Bank Branch Locator</h1>
        <PlaceSearch onSelectPlace={setSelectedPlace} />
        <LocateMeButton onLocate={setUserLocation} />
        <BranchTypeFilter value={typeFilter} onChange={setTypeFilter} />
        <p className="text-sm text-gray-500">
          Showing {visibleBranches.length} of {branches.length} branches
        </p>
        {nearestBranch && (
          <p className="text-sm text-gray-600">
            Nearest: {nearestBranch.branch.name} ({nearestBranch.distanceKm.toFixed(1)} km)
          </p>
        )}
      </div>

      <main className="relative flex-1">
        <LeafletMap branches={visibleBranches} selectedPlace={selectedPlace} nearestBranch={nearestBranch} />
        <MapLegend />
      </main>
    </div>
  );
};

export default BranchesPage;
