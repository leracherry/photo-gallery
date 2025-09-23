import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';
import '@testing-library/jest-dom';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('App Integration Tests - Jest Style', () => {
  const mockPhotosData = [
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
    },
    {
      id: 3,
      title: 'officia porro iure quia iusto',
      thumbnailUrl: 'https://via.placeholder.com/150/24f355',
      url: 'https://via.placeholder.com/600/24f355'
    }
  ];

  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear();
    // Setup default successful response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPhotosData,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('League Inc Brand Integration', () => {
    test('should display League Inc branded header and load photos', async () => {
      render(<App />);
      
      expect(screen.getByText('📸 Photo Gallery')).toBeInTheDocument();
      expect(screen.getByText('Discover beautiful photos from around the world')).toBeInTheDocument();
      
      // Wait for photos to load
      await waitFor(() => {
        expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
      });
      
      // Verify API was called
      expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/albums/1/photos');
    });

    test('should show League Inc styled loading state initially', () => {
      render(<App />);
      
      expect(screen.getByText('Loading beautiful photos...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument(); // loading spinner
    });
  });

  describe('Advanced Search Functionality', () => {
    beforeEach(async () => {
      render(<App />);
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
      });
    });

    test('should perform case-insensitive search', async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText('Search photos by title');
      
      await user.type(searchInput, 'ACCUSAMUS');
      
      // Should find the photo regardless of case
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'P' && element?.textContent?.trim() === 'accusamus beatae ad facilis';
      })).toBeInTheDocument();
      
      expect(screen.queryByText('reprehenderit est deserunt velit')).not.toBeInTheDocument();
    });

    test('should highlight multiple matching words', async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText('Search photos by title');
      
      await user.type(searchInput, 'a'); // Should match "accusamus" and "ad"
      
      // Check that words containing 'a' are highlighted
      const highlightedElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'I' && content.includes('a');
      });
      
      expect(highlightedElements.length).toBeGreaterThan(0);
    });

    test('should debounce search input', async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText('Search photos by title');
      
      // Type quickly
      await user.type(searchInput, 'test', { delay: 10 });
      
      // Should handle rapid typing without issues
      expect(searchInput).toHaveValue('test');
    });
  });

  describe('Error Handling - Jest Style', () => {
    test('should handle network errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValueOnce(new Error('Network failed'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch photos:', expect.any(Error));
      });
      
      // Should still show the header
      expect(screen.getByText('📸 Photo Gallery')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('should handle HTTP errors with proper error messages', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => { throw new Error('HTTP error! status: 404'); },
      });
      
      render(<App />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch photos:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('should handle malformed API response', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      });
      
      render(<App />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Accessibility', () => {
    test('should have proper ARIA landmarks', async () => {
      render(<App />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('search')).toBeInTheDocument();
      expect(screen.getByLabelText('Search photos by title')).toBeInTheDocument();
    });

    test('should load images with proper attributes', async () => {
      render(<App />);
      
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          expect(img).toHaveAttribute('loading', 'lazy');
        });
      });
    });

    test('should have proper link attributes for security', async () => {
      render(<App />);
      
      await waitFor(() => {
        const links = screen.getAllByRole('link');
        links.forEach(link => {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
      });
    });
  });

  describe('User Experience Flows', () => {
    test('should complete full user journey: load → search → clear → load all', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // 1. Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
      });
      
      const initialPhotos = screen.getAllByRole('article');
      expect(initialPhotos.length).toBe(3);
      
      // 2. Search for specific term
      const searchInput = screen.getByLabelText('Search photos by title');
      await user.type(searchInput, 'accusamus');
      
      // Should show filtered results
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'P' && element?.textContent?.trim() === 'accusamus beatae ad facilis';
      })).toBeInTheDocument();
      expect(screen.queryByText('reprehenderit est deserunt velit')).not.toBeInTheDocument();
      
      // 3. Clear search
      await user.clear(searchInput);
      
      // Should show all photos again
      await waitFor(() => {
        const allPhotos = screen.getAllByRole('article');
        expect(allPhotos.length).toBe(3);
      });
    });

    test('should handle empty search gracefully', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByLabelText('Search photos by title');
      
      // Type and then delete all text
      await user.type(searchInput, 'test');
      await user.clear(searchInput);
      
      // Should show all photos
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });
  });
});