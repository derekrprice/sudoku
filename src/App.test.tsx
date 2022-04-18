import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders game title', () => {
  render(<App />);
  const title = screen.getByText(/Sudoku!/i);
  expect(title).toBeInTheDocument();
});

it('renders the byline', () => {
  render(<App />);
  const byline = screen.getByText(/by Derek Price/i);
  expect(byline).toBeInTheDocument();
});
