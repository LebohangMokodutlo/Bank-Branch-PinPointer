export const buildGoogleMapsDirectionsUrl = (latitude, longitude, origin) => {
   const destination = encodeURIComponent(`${latitude},${longitude}`);
  const originParam = origin
    ? `&origin=${encodeURIComponent(`${origin.latitude},${origin.longitude}`)}`
    : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}${originParam}`;
 };
