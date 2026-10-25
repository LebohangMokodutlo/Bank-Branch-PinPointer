import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LocateMeButton from '../../../features/branches/components/LocateMeButton';

describe('LocateMeButton', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls onLocate with the resolved coordinates on success', () => {
    const handleLocate = vi.fn();
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (onSuccess) => {
          onSuccess({ coords: { latitude: -26.2041, longitude: 28.0473 } });
        },
      },
    });

    render(<LocateMeButton onLocate={handleLocate} />);
    fireEvent.click(screen.getByText('Use my location'));

    expect(handleLocate).toHaveBeenCalledWith({ latitude: -26.2041, longitude: 28.0473 });
  });

  it('shows an error message and does not call onLocate when the browser denies permission', () => {
    const handleLocate = vi.fn();
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (_onSuccess, onError) => {
          onError({ message: 'User denied Geolocation' });
        },
      },
    });

    render(<LocateMeButton onLocate={handleLocate} />);
    fireEvent.click(screen.getByText('Use my location'));

    expect(handleLocate).not.toHaveBeenCalled();
    expect(screen.getByText('User denied Geolocation')).toBeInTheDocument();
  });

  it('shows an error message when the browser has no geolocation support at all', () => {
    const handleLocate = vi.fn();
    vi.stubGlobal('navigator', {});

    render(<LocateMeButton onLocate={handleLocate} />);
    fireEvent.click(screen.getByText('Use my location'));

    expect(handleLocate).not.toHaveBeenCalled();
    expect(screen.getByText('Geolocation is not supported by this browser.')).toBeInTheDocument();
  });
});
