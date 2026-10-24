export const CLUSTER_TIERS = [
  { maxCount: 10, diameterPx: 30, color: 'rgba(51, 122, 130, 1)', borderColor: 'rgba(0, 86, 102, 0.7)', label: 'Fewer than 10 branches' },
  { maxCount: 50, diameterPx: 40, color: 'rgba(108, 111, 122, 1)', borderColor: 'rgba(61, 68, 78, 0.7)', label: '10 to 49 branches' },
  { maxCount: Infinity, diameterPx: 50, color: 'rgba(251, 106, 124, 1)', borderColor: 'rgba(250, 16, 22, 0.7)', label: '50 or more branches' },
];

export const MARKER_CLUSTER_OPTIONS = {
  maxClusterRadius: 30,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
};

export const getClusterTier = (count) => {
  return CLUSTER_TIERS.find((tier) => count < tier.maxCount) ?? CLUSTER_TIERS[CLUSTER_TIERS.length - 1];
}
