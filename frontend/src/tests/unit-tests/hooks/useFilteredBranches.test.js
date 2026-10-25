import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFilteredBranches } from '../../../features/branches/hooks/useFilteredBranches';
import { typeFilterOptions } from '../../../constants';

const branches = [
  { id: 'sandton-branch', type: typeFilterOptions.branch, latitude: -26.1076, longitude: 28.0567 },
  { id: 'sandton-atm', type: typeFilterOptions.atm, latitude: -26.108, longitude: 28.057 },
  { id: 'cape-town-branch', type: typeFilterOptions.branch, latitude: -33.9249, longitude: 18.4241 },
];

describe('useFilteredBranches', () => {
  it('returns every branch when no filters are applied', () => {
    const { result } = renderHook(() =>
      useFilteredBranches(branches, { selectedPlace: null, typeFilter: typeFilterOptions.all }),
    );

    expect(result.current.typeFiltered).toHaveLength(3);
    expect(result.current.visibleBranches).toHaveLength(3);
  });

  it('restricts to only branches (not ATMs) when filtered by type', () => {
    const { result } = renderHook(() =>
      useFilteredBranches(branches, { selectedPlace: null, typeFilter: typeFilterOptions.branch }),
    );

    expect(result.current.typeFiltered.map((b) => b.id)).toEqual(['sandton-branch', 'cape-town-branch']);
  });

  it('restricts to only ATMs when filtered by type', () => {
    const { result } = renderHook(() =>
      useFilteredBranches(branches, { selectedPlace: null, typeFilter: typeFilterOptions.atm }),
    );

    expect(result.current.typeFiltered.map((b) => b.id)).toEqual(['sandton-atm']);
  });

  it('narrows visibleBranches to those near a selected place, independent of the type filter', () => {
    const sandtonPlace = { latitude: -26.1076, longitude: 28.0567 };

    const { result } = renderHook(() =>
      useFilteredBranches(branches, { selectedPlace: sandtonPlace, typeFilter: typeFilterOptions.all }),
    );

    // The Cape Town branch is well over 20km away and should be excluded from what's drawn,
    // while still being present in typeFiltered (which "nearest branch" reads from).
    expect(result.current.visibleBranches.map((b) => b.id).sort()).toEqual(['sandton-atm', 'sandton-branch']);
    expect(result.current.typeFiltered).toHaveLength(3);
  });

  it('combines both filters when a place and a type are both selected', () => {
    const sandtonPlace = { latitude: -26.1076, longitude: 28.0567 };

    const { result } = renderHook(() =>
      useFilteredBranches(branches, { selectedPlace: sandtonPlace, typeFilter: typeFilterOptions.atm }),
    );

    expect(result.current.visibleBranches.map((b) => b.id)).toEqual(['sandton-atm']);
  });
});
