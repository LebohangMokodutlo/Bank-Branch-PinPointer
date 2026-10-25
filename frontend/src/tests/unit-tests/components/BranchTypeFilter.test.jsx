import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BranchTypeFilter from '../../../features/branches/components/BranchTypeFilter';
import { typeFilterOptions } from '../../../constants';

describe('BranchTypeFilter', () => {
  it('renders all three options', () => {
    render(<BranchTypeFilter value={typeFilterOptions.all} onChange={() => {}} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Branches')).toBeInTheDocument();
    expect(screen.getByText('ATMs')).toBeInTheDocument();
  });

  it('calls onChange with the clicked option\'s value', () => {
    const handleChange = vi.fn();
    render(<BranchTypeFilter value={typeFilterOptions.all} onChange={handleChange} />);

    fireEvent.click(screen.getByText('ATMs'));

    expect(handleChange).toHaveBeenCalledWith(typeFilterOptions.atm);
  });

  it('visually highlights whichever option matches the current value', () => {
    render(<BranchTypeFilter value={typeFilterOptions.branch} onChange={() => {}} />);

    expect(screen.getByText('Branches')).toHaveClass('bg-primary');
    expect(screen.getByText('All')).not.toHaveClass('bg-primary');
  });
});
