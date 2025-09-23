import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, vi } from 'vitest';
import SearchBar from '../components/SearchBar';
import '@testing-library/jest-dom';

describe('SearchBar', () => {
  test('renders search input', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search photos by title...')).toBeInTheDocument();
  });

  test('calls onSearch when typing', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search photos by title...');
    await user.type(input, 'test');
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('has proper accessibility attributes', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search photos by title...');
    expect(input).toHaveAttribute('aria-label', 'Search photos by title');
  });
});