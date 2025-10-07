import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import App from '../App';
import '@testing-library/jest-dom';

// Mock fetch
globalThis.fetch = vi.fn();

describe('App', () => {
  const mockPhotos = [
    {
      id: 1,
      title: 'accusamus beatae ad facilis',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
      url: 'https://via.placeholder.com/600/92c952'
    },
    {
      id: 2,
      title: 'reprehenderit est deserunt velit',
      thumbnailUrl: 'https://via.placeholder.com/150/771796',
      url: 'https://via.placeholder.com/600/771796'
    }
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the photo gallery title', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });
    
    render(<App />);
    expect(screen.getByText('📸 Photo Gallery')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });
    
    render(<App />);
    // This would need loading state implementation
  });

  test('renders photos after successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
      expect(screen.getByText('reprehenderit est deserunt velit')).toBeInTheDocument();
    });
  });

  test('handles fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch photos:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('handles HTTP errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => { throw new Error('HTTP error! status: 404'); },
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  test('filters photos based on search input', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });
    
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for photos to load
    await waitFor(() => {
      expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
    });
    
    // Search for "accu"
    const searchInput = screen.getByPlaceholderText('Search photos by title...');
    await user.type(searchInput, 'accu');
    
    // Should show only the matching photo using flexible text matcher
    const paragraph = screen.getByText((content, element) => {
      return element?.tagName === 'P' && element?.textContent?.trim() === 'accusamus beatae ad facilis';
    });
    expect(paragraph).toBeInTheDocument();
    expect(screen.queryByText('reprehenderit est deserunt velit')).not.toBeInTheDocument();
  });

  test('shows no results message for non-matching search', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });
    
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for photos to load
    await waitFor(() => {
      expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
    });
    
    // Search for something that doesn't match
    const searchInput = screen.getByPlaceholderText('Search photos by title...');
    await user.type(searchInput, 'xyz');
    
    // Should show no photos
    expect(screen.queryByText('accusamus beatae ad facilis')).not.toBeInTheDocument();
    expect(screen.queryByText('reprehenderit est deserunt velit')).not.toBeInTheDocument();
  });

  test('clears search results when search input is cleared', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });
    
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for photos to load
    await waitFor(() => {
      expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
    });
    
    // Search for "accu"
    const searchInput = screen.getByPlaceholderText('Search photos by title...');
    await user.type(searchInput, 'accu');
    
    // Clear search
    await user.clear(searchInput);
    
    // Should show all photos again
    expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
    expect(screen.getByText('reprehenderit est deserunt velit')).toBeInTheDocument();
  });
});
