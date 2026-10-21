import { useQuery } from '@tanstack/react-query';
import { getBranches } from '../api/getBranches';
import { queryKeys } from '../../../constants';

export const useBranches = () => {
  return useQuery({
    queryKey: [queryKeys.branches],
    queryFn: getBranches,
  });
};
