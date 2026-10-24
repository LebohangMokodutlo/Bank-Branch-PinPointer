import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leafletIconFix';

const SOUTH_AFRICA_CENTER = [-29.0, 24.5];
const INITIAL_ZOOM = 6;

const LeafletMap = ({ branches, selectedPlace, nearestBranch }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersByIdRef = useRef(new Map());

  useEffect(() => {
    const map = L.map(mapContainerRef.current, {
      center: SOUTH_AFRICA_CENTER,
      zoom: INITIAL_ZOOM,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || branches.length === 0) {
      return;
    }

    markersByIdRef.current.forEach((marker) => marker.remove());
    markersByIdRef.current = new Map();

    branches.forEach((branch) => {
      const marker = L.marker([branch.latitude, branch.longitude])
        .addTo(map)
        .bindPopup(
          `<strong>${branch.name}</strong><br/>${branch.address.street}, ${branch.address.city}`,
        );
      markersByIdRef.current.set(branch.id, marker);
    });

    map.fitBounds([...markersByIdRef.current.values()].map((marker) => marker.getLatLng()));
  }, [branches]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace) {
      return;
    }

    map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 13);
  }, [selectedPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !nearestBranch) {
      return;
    };

    const { branch } = nearestBranch;
    map.flyTo([branch.latitude, branch.longitude], 14);
    markersByIdRef.current.get(branch.id)?.openPopup();
  }, [nearestBranch]);

  return <div ref={mapContainerRef} className="leaflet-map-container" />;
};

export default LeafletMap;
