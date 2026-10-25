import { useMemo } from 'react';
import { getDistanceInKm } from '../../../shared/utils/distance';

const NEARBY_RADIUS_KM = 20;
const SEARCH_COUNT_THRESHOLD = 3;
const SUFFICIENT_BRANCH_COUNT = 3;

export function useSearchDemand(searchHistory, branches) {
  return useMemo(() => {
    return searchHistory.map((entry) => {
      const nearbyBranchCount = branches.filter(
        (branch) =>
          getDistanceInKm(entry, { latitude: branch.latitude, longitude: branch.longitude }) <=
          NEARBY_RADIUS_KM,
      ).length;

      const needsMoreBranches =
        entry.count >= SEARCH_COUNT_THRESHOLD && nearbyBranchCount < SUFFICIENT_BRANCH_COUNT;

      return { ...entry, nearbyBranchCount, needsMoreBranches };
    });
  }, [searchHistory, branches]);
}
