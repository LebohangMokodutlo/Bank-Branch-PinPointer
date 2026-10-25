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

const LeafletMap = ({ branches, selectedPlace, nearestBranch, userLocation }) => {
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
      const marker = L.marker([branch.latitude, branch.longitude]).bindPopup(
        buildPopupHtml(branch, userLocation),
      );
      markersByIdRef.current.set(branch.id, { marker, branch });
       return marker;
     });


    clusterGroup.addLayers(markers);
    mapRef.current?.fitBounds(clusterGroup.getBounds(), { padding: [32, 32] });
  }, [branches]);

 const buildPopupHtml = (branch, userLocation) => {
  const isAtm = branch.type === 'Atm';
  const typeLabel = isAtm ? 'ATM only' : 'Full-service branch';
  const typeBadgeClass = isAtm ? 'bg-gray-100 text-gray-600' : 'bg-primary-light text-primary-dark';
   const directionsUrl = buildGoogleMapsDirectionsUrl(branch.latitude, branch.longitude, userLocation);
  const telHref = `tel:${branch.phone.replace(/\s+/g, '')}`;

  const servicesChips = branch.services
    .map(
      (service) =>
        `<span class="mr-1 mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">${escapeHtml(service)}</span>`,
    )
    .join('');

   return `
   <div class="min-w-[240px] font-sans">
      <p class="text-[15px] font-semibold text-gray-900">${escapeHtml(branch.name)}</p>
      <span class="mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${typeBadgeClass}">
        ${typeLabel}
      </span>

      <div class="mt-2 space-y-1.5 text-[13px] text-gray-700">
        <div class="flex items-start gap-1.5">
          <span class="mdi mdi-map-marker-outline text-gray-400"></span>
          <span>${escapeHtml(branch.address.street)}, ${escapeHtml(branch.address.suburb)}<br/>${escapeHtml(branch.address.city)}, ${escapeHtml(branch.address.postalCode)}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="mdi mdi-phone-outline text-gray-400"></span>
          <a href="${telHref}" class="text-gray-700 no-underline">${escapeHtml(branch.phone)}</a>
       </div>
      </div>

      <div class="mt-2.5 border-t border-gray-200 pt-2">
        ${servicesChips}
      </div>

     <a
        href="${directionsUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-[13px] font-semibold text-white no-underline hover:bg-primary-dark"
      >
        <span class="mdi mdi-directions"></span>
        Get directions
     </a>
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

    const entry = markersByIdRef.current.get(nearestBranch.branch.id);
    if (!entry) {
       return;
     }

    clusterGroup.zoomToShowLayer(entry.marker, () => entry.marker.openPopup());
  }, [nearestBranch]);

  return <div ref={mapContainerRef} className="leaflet-map-container" />;
};

export default LeafletMap;
