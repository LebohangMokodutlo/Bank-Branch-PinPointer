import { describe, expect, it } from 'vitest';
import { buildGoogleMapsDirectionsUrl } from './googleMapsDirections';

describe('buildGoogleMapsDirectionsUrl', () => {
  it('builds a destination-only URL when no origin is given', () => {
    const url = buildGoogleMapsDirectionsUrl(-26.1076, 28.0567);

    expect(url).toBe('https://www.google.com/maps/dir/?api=1&destination=-26.1076%2C28.0567');
    expect(url).not.toContain('origin=');
  });

  it('includes an origin parameter when the user\'s location is known', () => {
    const url = buildGoogleMapsDirectionsUrl(-26.1076, 28.0567, {
      latitude: -26.2041,
      longitude: 28.0473,
    });

    expect(url).toContain('destination=-26.1076%2C28.0567');
    expect(url).toContain('origin=-26.2041%2C28.0473');
  });

  it('url-encodes both coordinate pairs so the result is safe to embed in HTML', () => {
    const url = buildGoogleMapsDirectionsUrl(-33.9249, 18.4241, { latitude: -29.8587, longitude: 31.0218 });

    // The only commas that should survive are the ones inside Google's own query string
    // separators - the coordinate pairs themselves must use the encoded %2C form.
    expect(url).not.toMatch(/-33\.9249,18\.4241/);
    expect(url).not.toMatch(/-29\.8587,31\.0218/);
  });
});
