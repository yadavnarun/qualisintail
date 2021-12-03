import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders base heading', () => {
  render(<App />);
  const h = screen.getByText(/Hello/i);
  expect(h).toBeInTheDocument();
});
