import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { searchPlaces } from '../api/searchPlaces';

const MIN_QUERY_LENGTH = 2;

export const usePlaceSearch = (query) => {
  const debouncedQuery = useDebounce(query, 300);
  const trimmedQuery = debouncedQuery.trim();

  const {
    data,
    isFetching,
	} = useQuery({
    queryKey: ['places', trimmedQuery],
    queryFn: () => searchPlaces(trimmedQuery),
    enabled: trimmedQuery.length >= MIN_QUERY_LENGTH,
  });

  return {
    suggestions: trimmedQuery.length >= MIN_QUERY_LENGTH ? data ?? [] : [],
    isSearching: isFetching,
  };
};
