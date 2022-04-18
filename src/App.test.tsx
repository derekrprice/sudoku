import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game title', () => {
  render(<App />);
  const title = screen.getByText(/Sudoku!/i);
  expect(title).toBeInTheDocument();
});
