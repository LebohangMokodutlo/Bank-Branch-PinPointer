import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useNearestBranch } from '../../../features/branches/hooks/useNearestBranch';

const sandtonBranch = { id: 'sandton', latitude: -26.1076, longitude: 28.0567 };
const capeTownBranch = { id: 'cape-town', latitude: -33.9249, longitude: 18.4241 };
const branches = [sandtonBranch, capeTownBranch];

describe('useNearestBranch', () => {
  it('returns null when there is no user location yet', () => {
    const { result } = renderHook(() => useNearestBranch(null, branches));
    expect(result.current).toBeNull();
  });

  it('returns null when there are no branches to compare against', () => {
    const userLocation = { latitude: -26.2041, longitude: 28.0473 };
    const { result } = renderHook(() => useNearestBranch(userLocation, []));
    expect(result.current).toBeNull();
  });

  it('picks the closer branch and reports a positive distance', () => {
    // Close to Johannesburg CBD - should be nearer to the Sandton branch than Cape Town's.
    const userLocation = { latitude: -26.2041, longitude: 28.0473 };

    const { result } = renderHook(() => useNearestBranch(userLocation, branches));

    expect(result.current.branch.id).toBe('sandton');
    expect(result.current.distanceKm).toBeGreaterThan(0);
  });

  it('switches to the other branch once the user is closer to it instead', () => {
    const nearCapeTown = { latitude: -33.9, longitude: 18.4 };

    const { result } = renderHook(() => useNearestBranch(nearCapeTown, branches));

    expect(result.current.branch.id).toBe('cape-town');
  });
});
