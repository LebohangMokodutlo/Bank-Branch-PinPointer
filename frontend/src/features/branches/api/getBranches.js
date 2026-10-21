import { getJson } from '../../../shared/lib/apiClient';

export const getBranches = () => {
  return getJson('/api/branches');
};
