import { useEffect, useState } from 'react';
import { CLUSTER_TIERS } from '../constants/clusterConfig';

const AUTO_HIDE_BREAKPOINT_PX = 800;

const MapLegend = () => {
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    () => window.innerWidth <= AUTO_HIDE_BREAKPOINT_PX,
  );

  useEffect(() => {
    const handleResize = () => setIsNarrowViewport(window.innerWidth <= AUTO_HIDE_BREAKPOINT_PX);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isVisible = !isManuallyHidden && !isNarrowViewport;

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsManuallyHidden(false)}
        className="absolute bottom-6 right-4 z-[1000] rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-lg hover:bg-primary-light"
      >
        Show legend
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 right-4 z-[1000] w-64 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Cluster legend</h2>
        <button
          type="button"
          onClick={() => setIsManuallyHidden(true)}
          aria-label="Hide legend"
          className="text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      <ul className="space-y-2">
        {CLUSTER_TIERS.map((tier) => (
          <li key={tier.label} className="flex items-center gap-2 text-sm text-gray-600">
            <span
              className="inline-block h-4 w-4 rounded-full border-2"
              style={{ backgroundColor: tier.color, borderColor: tier.borderColor }}
            />
            {tier.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapLegend;
