import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import MapLegend from './MapLegend';

function setViewportWidth(width) {
  window.innerWidth = width;
  // The resize listener updates state outside of React's own event handling, so without
  // act(), the assertion right after this call could run before React has flushed the
  // resulting re-render.
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

describe('MapLegend', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    setViewportWidth(1200); // well above the 800px auto-hide breakpoint
  });

  afterEach(() => {
    setViewportWidth(originalInnerWidth);
  });

  it('shows all three cluster tiers by default on a wide viewport', () => {
    render(<MapLegend />);

    expect(screen.getByText('Cluster legend')).toBeInTheDocument();
    expect(screen.getByText('Fewer than 10 branches')).toBeInTheDocument();
    expect(screen.getByText('10 to 49 branches')).toBeInTheDocument();
    expect(screen.getByText('50 or more branches')).toBeInTheDocument();
  });

  it('collapses to a "Show legend" button when manually hidden', () => {
    render(<MapLegend />);

    fireEvent.click(screen.getByLabelText('Hide legend'));

    expect(screen.queryByText('Cluster legend')).not.toBeInTheDocument();
    expect(screen.getByText('Show legend')).toBeInTheDocument();
  });

  it('reappears when "Show legend" is clicked again', () => {
    render(<MapLegend />);

    fireEvent.click(screen.getByLabelText('Hide legend'));
    fireEvent.click(screen.getByText('Show legend'));

    expect(screen.getByText('Cluster legend')).toBeInTheDocument();
  });

  it('auto-hides once the viewport narrows past the 800px breakpoint', () => {
    render(<MapLegend />);
    expect(screen.getByText('Cluster legend')).toBeInTheDocument();

    setViewportWidth(500);

    expect(screen.queryByText('Cluster legend')).not.toBeInTheDocument();
    expect(screen.getByText('Show legend')).toBeInTheDocument();
  });
});
