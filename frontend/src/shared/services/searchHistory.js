import { storageKeys } from '../../constants';

const STORAGE_KEY = storageKeys.searchHistory;

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export function recordSearch(place) {
  const history = readHistory();
  const existing = history[place.id];

  history[place.id] = {
    id: place.id,
    name: place.name,
    province: place.province,
    latitude: place.latitude,
    longitude: place.longitude,
    count: (existing?.count ?? 0) + 1,
  };

  writeHistory(history);
}

export function getSearchHistory() {
  return Object.values(readHistory()).sort((a, b) => b.count - a.count);
}

export function clearSearchHistory() {
  writeHistory({});
}
