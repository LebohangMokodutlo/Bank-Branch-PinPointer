import { useState } from 'react';
import { usePlaceSearch } from '../hooks/usePlacesSearch';

const PlaceSearch = ({ onSelectPlace }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { suggestions, isSearching } = usePlaceSearch(query);

  const handleSelect = (place) => {
    onSelectPlace(place);
    setQuery(place.name);
    setIsOpen(false);
  };

  return (
    <div className="relative w-100">
      <input
        type="text"
        value={query}
        placeholder="Search a city or suburb..."
				onChange={(event) => {
          const newQuery = event.target.value;
          setQuery(newQuery);
          if (newQuery.trim() === '') {
            onSelectPlace(null);
          }
          setIsOpen(true);
        }}

        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary-light"
      />

      {isOpen && query.trim().length > 0 && (
        <ul className="absolute z-[1000] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {isSearching && <li className="px-4 py-2 text-sm text-gray-400">Searching...</li>}
          {!isSearching && suggestions.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-400">No places found</li>
          )}
          {!isSearching &&
            suggestions.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(place)}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-primary-light"
                >
                  {place.name}
                  <span className="ml-2 text-xs text-gray-400">{place.province}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default PlaceSearch;
