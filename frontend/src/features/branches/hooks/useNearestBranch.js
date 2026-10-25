import { useMemo } from 'react';
import { getDistanceInKm } from '../../../shared/utils/distance';

export const useNearestBranch = (userLocation, branches) => {
  return useMemo(() => {
    if (!userLocation || !branches?.length) {
      return null;
    }

    let nearest = null;
    let shortestDistanceKm = Infinity;

    for (const branch of branches) {
      const distanceKm = getDistanceInKm(userLocation, {
        latitude: branch.latitude,
        longitude: branch.longitude,
      });

      if (distanceKm < shortestDistanceKm) {
        shortestDistanceKm = distanceKm;
        nearest = branch;
      }
    }

    return nearest ? { branch: nearest, distanceKm: shortestDistanceKm } : null;
  }, [userLocation, branches]);
};
