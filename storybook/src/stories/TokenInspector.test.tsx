import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TokenInspector from '../../../packages/ui/src/TokenInspector';

describe('TokenInspector', () => {
  it('renders the provided category', () => {
    render(<TokenInspector category="colors" />);

    // The component should display the category string somewhere
    expect(screen.getByText(/colors/i)).toBeInTheDocument();
  });

  it('updates when the category prop changes (re-render)', () => {
    const { rerender } = render(<TokenInspector category="colors" />);

    expect(screen.getByText(/colors/i)).toBeInTheDocument();

    // Simulate a prop change by re-rendering with a new category
    rerender(<TokenInspector category="spacing" />);

    expect(screen.getByText(/spacing/i)).toBeInTheDocument();
  });
});
