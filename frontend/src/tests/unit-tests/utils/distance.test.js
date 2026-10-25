import { describe, expect, it } from 'vitest';
import { getDistanceInKm } from '../../../shared/utils/distance';

describe('getDistanceInKm', () => {
  it('returns 0 for identical points', () => {
    const point = { latitude: -26.2041, longitude: 28.0473 };
    expect(getDistanceInKm(point, point)).toBeCloseTo(0, 5);
  });

  it('matches the known ~111.2km-per-degree-of-latitude figure', () => {
    // At the equator, 1 degree of latitude is almost exactly 111.2km - a good sanity check
    // for the haversine formula that doesn't depend on looking up a real-world distance.
    const distanceKm = getDistanceInKm({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 0 });
    expect(distanceKm).toBeCloseTo(111.2, 0);
  });

  it('is symmetric - distance from A to B equals distance from B to A', () => {
    const sandton = { latitude: -26.1076, longitude: 28.0567 };
    const capeTownCbd = { latitude: -33.9249, longitude: 18.4241 };

    expect(getDistanceInKm(sandton, capeTownCbd)).toBeCloseTo(getDistanceInKm(capeTownCbd, sandton), 6);
  });

  it('returns a larger distance for points further apart', () => {
    const origin = { latitude: -26.2041, longitude: 28.0473 };
    const near = { latitude: -26.21, longitude: 28.05 };
    const far = { latitude: -33.9249, longitude: 18.4241 };

    expect(getDistanceInKm(origin, near)).toBeLessThan(getDistanceInKm(origin, far));
  });
});
