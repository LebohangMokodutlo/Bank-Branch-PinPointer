export const buildGoogleMapsDirectionsUrl = (latitude, longitude) => {
  const destination = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
};
