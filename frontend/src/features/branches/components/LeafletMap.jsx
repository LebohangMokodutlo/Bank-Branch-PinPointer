import { useEffect, useRef } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import './leafletIconFix';
import { getClusterTier, MARKER_CLUSTER_OPTIONS } from '../constants/clusterConfig';

const SOUTH_AFRICA_CENTER = [-29.0, 24.5];
const INITIAL_ZOOM = 6;

const LeafletMap = ({ branches, selectedPlace, nearestBranch }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const clusterGroupRef = useRef(null);
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

    const clusterGroup = L.markerClusterGroup({
      ...MARKER_CLUSTER_OPTIONS,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const tier = getClusterTier(count);

        return L.divIcon({
          html: `<div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${tier.diameterPx}px;
              height: ${tier.diameterPx}px;
              border-radius: 50%;
              background: ${tier.color};
              border: 3px solid ${tier.borderColor};
              color: white;
              font-weight: 600;
              font-size: ${tier.diameterPx / 3}px;
            ">${count}</div>`,
          className: '',
          iconSize: [tier.diameterPx, tier.diameterPx],
        });
      },
    });

    map.addLayer(clusterGroup);

    mapRef.current = map;
    clusterGroupRef.current = clusterGroup;

    return () => {
      map.remove();
      mapRef.current = null;
      clusterGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup || branches.length === 0) {
      return;
    }

    clusterGroup.clearLayers();
    markersByIdRef.current = new Map();

    const markers = branches.map((branch) => {
      const marker = L.marker([branch.latitude, branch.longitude]).bindPopup(
        `<strong>${branch.name}</strong><br/>${branch.address.street}, ${branch.address.city}`,
      );
      markersByIdRef.current.set(branch.id, marker);
      return marker;
    });

    clusterGroup.addLayers(markers);
    mapRef.current?.fitBounds(clusterGroup.getBounds(), { padding: [32, 32] });
  }, [branches]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace) {
      return;
    }

    map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 13);
  }, [selectedPlace]);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup || !nearestBranch) {
      return;
    }

    const marker = markersByIdRef.current.get(nearestBranch.branch.id);
    if (!marker) {
      return;
    }

    clusterGroup.zoomToShowLayer(marker, () => marker.openPopup());
  }, [nearestBranch]);

  return <div ref={mapContainerRef} className="leaflet-map-container" />;
};

export default LeafletMap;
