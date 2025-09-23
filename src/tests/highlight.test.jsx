import { render } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import highlightTitle from '../utils/highlight';
import '@testing-library/jest-dom';

describe('highlightTitle', () => {
  test('returns original title when no search term', () => {
    const result = highlightTitle('accusamus beatae ad facilis', '');
    expect(result).toBe('accusamus beatae ad facilis');
  });

  test('highlights matching words', () => {
    const result = highlightTitle('accusamus beatae ad facilis', 'accu');
    
    // Render the result to test JSX structure
    const { container } = render(<div>{result}</div>);
    
    // Check that accusamus is highlighted
    const highlighted = container.querySelector('i');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted?.textContent).toBe('accusamus');
  });

  test('is case insensitive', () => {
    const result = highlightTitle('Accusamus Beatae Ad Facilis', 'ACCU');
    
    const { container } = render(<div>{result}</div>);
    
    const highlighted = container.querySelector('i');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted?.textContent).toBe('Accusamus');
  });

  test('highlights partial word matches', () => {
    const result = highlightTitle('accusamus beatae ad facilis', 'beat');
    
    const { container } = render(<div>{result}</div>);
    
    const highlighted = container.querySelector('i');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted?.textContent).toBe('beatae');
  });
});