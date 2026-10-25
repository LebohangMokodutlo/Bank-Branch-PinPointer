import { useState } from 'react';
import LeafletMap from '../components/LeafletMap';
import PlaceSearch from '../components/PlacesSearch';
import LocateMeButton from '../components/LocateMeButton';
import BranchTypeFilter from '../components/BranchTypeFilter';
import MapLegend from '../components/MapLegend';
import { useBranches } from '../hooks/useBranches';
import { useNearestBranch } from '../hooks/useNearestBranch';
import { useFilteredBranches } from '../hooks/useFilteredBranches';

import { recordSearch } from '../../../shared/services/searchHistory';

const BranchesPage = () => {
  const { data: branches, isLoading, error } = useBranches();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const { typeFiltered, visibleBranches } = useFilteredBranches(branches, { selectedPlace, typeFilter });
  const nearestBranch = useNearestBranch(userLocation, typeFiltered);

 const handleSelectPlace = (place) => {
   setSelectedPlace(place);
   if (place) {
     recordSearch(place);
   }
 };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Couldn&apos;t load branches: {error.message}</p>;
  if (!branches?.length) return <p>No branches found.</p>;


return (
  <div className="relative h-full">
      <LeafletMap
    branches={visibleBranches}
    selectedPlace={selectedPlace}
    nearestBranch={nearestBranch}
   userLocation={userLocation}
  />

    <MapLegend />

    <div className="absolute left-4 top-4 z-[1000] flex flex-wrap items-center gap-3">
      <PlaceSearch onSelectPlace={handleSelectPlace} />
      <LocateMeButton onLocate={setUserLocation} />
      <BranchTypeFilter value={typeFilter} onChange={setTypeFilter} />
      {nearestBranch && (
        <p className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-600 shadow">
          Nearest: {nearestBranch.branch.name} ({nearestBranch.distanceKm.toFixed(1)} km)
        </p>
      )}
    </div>
  </div>
);

};

export default BranchesPage;
