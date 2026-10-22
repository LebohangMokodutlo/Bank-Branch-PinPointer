import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leafletIconFix';

const SOUTH_AFRICA_CENTER = [-29.0, 24.5];
const INITIAL_ZOOM = 6;

const BranchMap = ({ branches }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

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

    markersRef.current.forEach((marker) => marker.remove());

    markersRef.current = branches.map((branch) =>
      L.marker([branch.latitude, branch.longitude])
        .addTo(map)
        .bindPopup(
          `<strong>${branch.name}</strong><br/>${branch.address.street}, ${branch.address.city}`,
        ),
    );

    map.fitBounds(markersRef.current.map((marker) => marker.getLatLng()));
  }, [branches]);

  return <div ref={mapContainerRef} className="leaflet-map-container" />;
};

export default BranchMap;
