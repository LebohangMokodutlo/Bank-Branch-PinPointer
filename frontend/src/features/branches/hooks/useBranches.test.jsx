import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useBranches } from './useBranches';
import * as getBranchesModule from '../api/getBranches';

// useBranches is a thin useQuery wrapper, so it needs a real QueryClient above it in the tree -
// a fresh one per test avoids one test's cached result leaking into the next.
function renderWithQueryClient(hook) {
  // retry: false - otherwise a failing query retries 3 times with backoff delays before
  // settling into its error state, which blows well past waitFor's default timeout here.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}

describe('useBranches', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in a loading state with no data yet', () => {
    vi.spyOn(getBranchesModule, 'getBranches').mockReturnValue(new Promise(() => {}));

    const { result } = renderWithQueryClient(() => useBranches());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('exposes the fetched branches once the request resolves', async () => {
    const mockBranches = [{ id: '1', name: 'Capitec Bank - Sandton' }];
    vi.spyOn(getBranchesModule, 'getBranches').mockResolvedValue(mockBranches);

    const { result } = renderWithQueryClient(() => useBranches());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockBranches);
    expect(result.current.error).toBeNull();
  });

  it('exposes an error if the request fails', async () => {
    vi.spyOn(getBranchesModule, 'getBranches').mockRejectedValue(new Error('network down'));

    const { result } = renderWithQueryClient(() => useBranches());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
