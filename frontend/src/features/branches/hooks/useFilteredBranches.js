import { useMemo } from 'react';
import { getDistanceInKm } from '../utils/distance';

const SEARCH_FILTER_RADIUS_KM = 20;

export const useFilteredBranches = (branches, { selectedPlace, typeFilter }) => {
  const typeFiltered = useMemo(() => {
    if (typeFilter === 'all') {
      return branches;
    }
    return branches.filter((branch) => branch.type === typeFilter);
  }, [branches, typeFilter]);

  const visibleBranches = useMemo(() => {
    if (!selectedPlace) {
      return typeFiltered;
    };

    return typeFiltered.filter(
      (branch) =>
        getDistanceInKm(selectedPlace, { latitude: branch.latitude, longitude: branch.longitude }) <=
        SEARCH_FILTER_RADIUS_KM,
    );
  }, [typeFiltered, selectedPlace]);

  return { typeFiltered, visibleBranches };
};
