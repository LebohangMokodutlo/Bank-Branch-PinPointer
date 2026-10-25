import { useEffect, useRef } from 'react';
import { escapeHtml } from '../utils/escapeHtml';
import { buildGoogleMapsDirectionsUrl } from '../utils/googleMapsDirections';

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
    map.zoomControl.setPosition('bottomleft');
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
      const marker = L.marker([branch.latitude, branch.longitude]).bindPopup(buildPopupHtml(branch));
      markersByIdRef.current.set(branch.id, marker);
      return marker;
    });

    clusterGroup.addLayers(markers);
    mapRef.current?.fitBounds(clusterGroup.getBounds(), { padding: [32, 32] });
  }, [branches]);

  const buildPopupHtml = (branch) => {
  const servicesList = branch.services.map((service) => `<li>${escapeHtml(service)}</li>`).join('');
  const typeLabel = branch.type === 'Atm' ? 'ATM only' : 'Full-service branch';
  const directionsUrl = buildGoogleMapsDirectionsUrl(branch.latitude, branch.longitude);


  return `
    <div style="min-width: 200px;">
      <strong>${escapeHtml(branch.name)}</strong><br/>
      <span style="color: #6b7280; font-size: 12px;">${typeLabel}</span><br/>
      ${escapeHtml(branch.address.street)}, ${escapeHtml(branch.address.suburb)}<br/>
      ${escapeHtml(branch.address.city)}, ${escapeHtml(branch.address.postalCode)}<br/>
      Tel: ${escapeHtml(branch.phone)}
      <ul style="margin: 6px 0 0; padding-left: 18px;">${servicesList}</ul>
      <a
+        href="${directionsUrl}"
+        target="_blank"
+        rel="noopener noreferrer"
+        style="display: inline-block; margin-top: 8px; color: #2c70ef; font-weight: 600; text-decoration: none;"
+      >Get directions &rarr;</a>
    </div>
  `;
};

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
