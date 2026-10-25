import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PlaceSearch from '../../../features/branches/components/PlacesSearch';
import * as usePlacesSearchModule from '../../../features/branches/hooks/usePlacesSearch';

// Mocks the hook itself (debounce/fetch behaviour already has its own dedicated tests in
// usePlacesSearch.test.jsx), so this file can focus purely on "given these suggestions, does
// the dropdown render and react to clicks/clearing correctly?"
function mockSuggestions(suggestions, isSearching = false) {
  vi.spyOn(usePlacesSearchModule, 'usePlaceSearch').mockReturnValue({ suggestions, isSearching });
}

describe('PlaceSearch', () => {
  it('shows matching suggestions once the input has text', () => {
    mockSuggestions([{ id: '1', name: 'Sandton', province: 'Gauteng' }]);
    render(<PlaceSearch onSelectPlace={() => {}} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'San' } });

    expect(screen.getByText('Sandton')).toBeInTheDocument();
  });

  it('shows a loading message while a search is in flight', () => {
    mockSuggestions([], true);
    render(<PlaceSearch onSelectPlace={() => {}} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'San' } });

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows a "no places found" message when there are no matches', () => {
    mockSuggestions([]);
    render(<PlaceSearch onSelectPlace={() => {}} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });

    expect(screen.getByText('No places found')).toBeInTheDocument();
  });

  it('selecting a suggestion fills the input, closes the dropdown, and reports the place', () => {
    const handleSelectPlace = vi.fn();
    mockSuggestions([{ id: '1', name: 'Sandton', province: 'Gauteng' }]);
    render(<PlaceSearch onSelectPlace={handleSelectPlace} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'San' } });
    fireEvent.click(screen.getByText('Sandton'));

    expect(screen.getByRole('textbox')).toHaveValue('Sandton');
    expect(handleSelectPlace).toHaveBeenCalledWith({ id: '1', name: 'Sandton', province: 'Gauteng' });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('reports null when the search box is cleared, so the location filter resets', () => {
    const handleSelectPlace = vi.fn();
    mockSuggestions([]);
    render(<PlaceSearch onSelectPlace={handleSelectPlace} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'San' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(handleSelectPlace).toHaveBeenCalledWith(null);
  });
});
