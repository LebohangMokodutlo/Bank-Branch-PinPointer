import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlaceSearch } from '../../../features/branches/hooks/usePlacesSearch';
import * as searchPlacesModule from '../../../features/branches/api/searchPlaces';

function renderWithQueryClient(hook) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}

describe('usePlaceSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not call the API for a query shorter than 2 characters', () => {
    const searchSpy = vi.spyOn(searchPlacesModule, 'searchPlaces');

    const { result } = renderWithQueryClient(() => usePlaceSearch('a'));
    act(() => vi.advanceTimersByTime(500));

    expect(searchSpy).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
  });

  it('fetches suggestions once typing has paused for the debounce delay', async () => {
    const mockPlaces = [{ id: '1', name: 'Sandton' }];
    vi.spyOn(searchPlacesModule, 'searchPlaces').mockResolvedValue(mockPlaces);

    const { result, rerender } = renderWithQueryClient(({ query } = { query: '' }) => usePlaceSearch(query));

    rerender({ query: 'San' });
    // advanceTimersByTimeAsync also flushes the mocked promise's .then callback, which a plain
    // advanceTimersByTime plus waitFor can't do here - waitFor's own polling relies on real
    // timers, which are faked for the whole duration of this test. A second, zero-length
    // advance sweeps up the fetch that only *starts* once the 300ms debounce timer fires on
    // the first call - its own resolution lands one tick later.
    await act(() => vi.advanceTimersByTimeAsync(300));
    await act(() => vi.advanceTimersByTimeAsync(0));

    expect(result.current.suggestions).toEqual(mockPlaces);
    expect(searchPlacesModule.searchPlaces).toHaveBeenCalledWith('San');
  });

  it('clears suggestions back to empty once the query is cleared', async () => {
    const mockPlaces = [{ id: '1', name: 'Sandton' }];
    vi.spyOn(searchPlacesModule, 'searchPlaces').mockResolvedValue(mockPlaces);

    const { result, rerender } = renderWithQueryClient(({ query } = { query: '' }) => usePlaceSearch(query));

    rerender({ query: 'San' });
    await act(() => vi.advanceTimersByTimeAsync(300));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(result.current.suggestions).toEqual(mockPlaces);

    rerender({ query: '' });
    await act(() => vi.advanceTimersByTimeAsync(300));
    expect(result.current.suggestions).toEqual([]);
  });
});
