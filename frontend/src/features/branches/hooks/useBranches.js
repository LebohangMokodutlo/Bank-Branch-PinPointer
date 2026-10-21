import { useQuery } from '@tanstack/react-query'
import { getBranches } from '../api/getBranches'

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });
};
