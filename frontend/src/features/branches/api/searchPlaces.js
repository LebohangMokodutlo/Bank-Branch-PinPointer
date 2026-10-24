import { getJson } from '../../../shared/lib/apiClient';

export const searchPlaces = (query) => {
  const params = new URLSearchParams({ query });
  return getJson(`/api/places/autocomplete?${params}`);
};
