import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import PhotoList from '../components/PhotoList';
import '@testing-library/jest-dom';

describe('PhotoList', () => {
  const mockPhotos = [
    {
      id: 1,
      title: 'accusamus beatae ad facilis',
      thumbnailUrl: 'https://picsum.photos/200?random=1',
      url: 'https://picsum.photos/600?random=1'
    },
    {
      id: 2,
      title: 'reprehenderit est deserunt velit',
      thumbnailUrl: 'https://picsum.photos/200?random=2',
      url: 'https://picsum.photos/600?random=2'
    }
  ];

  test('renders all photos when no search term', () => {
    render(<PhotoList photos={mockPhotos} searchTerm="" isLoading={false} />);
    expect(screen.getByText('accusamus beatae ad facilis')).toBeInTheDocument();
    expect(screen.getByText('reprehenderit est deserunt velit')).toBeInTheDocument();
  });

  test('filters photos based on search term', () => {
    render(<PhotoList photos={mockPhotos} searchTerm="accu" isLoading={false} />);
    
    // Find the paragraph that contains the highlighted text
    const paragraph = screen.getByText((content, element) => {
      return element?.tagName === 'P' && element?.textContent?.trim() === 'accusamus beatae ad facilis';
    });
    expect(paragraph).toBeInTheDocument();
    expect(screen.queryByText('reprehenderit est deserunt velit')).not.toBeInTheDocument();
  });

  test('renders images with correct attributes', () => {
    render(<PhotoList photos={mockPhotos} searchTerm="" isLoading={false} />);
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'https://picsum.photos/200?random=1');
    expect(images[0]).toHaveAttribute('alt', 'accusamus beatae ad facilis');
  });

  test('renders links with correct attributes', () => {
    render(<PhotoList photos={mockPhotos} searchTerm="" isLoading={false} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'https://picsum.photos/600?random=1');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('has proper semantic structure', () => {
    render(<PhotoList photos={mockPhotos} searchTerm="" isLoading={false} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
  });

  test('highlights search terms in titles', () => {
    render(<PhotoList photos={mockPhotos} searchTerm="accu" isLoading={false} />);
    const highlighted = screen.getByText('accusamus');
    expect(highlighted.tagName).toBe('I');
  });
});