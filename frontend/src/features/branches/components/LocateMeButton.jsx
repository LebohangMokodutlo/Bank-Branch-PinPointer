import { useState } from 'react';

const LocateMeButton = ({ onLocate }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (geoError) => {
        setError(geoError.message);
        setIsLocating(false);
      },
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLocating}
        className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
      >
        <span className="mdi mdi-map-marker text-base" aria-hidden="true" />
        {isLocating ? 'Locating...' : 'Use my location'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default LocateMeButton;
