import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock router to avoid depending on react-router-dom ESM resolution in Jest (CRA ships Jest 27).
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element || null,
  Navigate: ({ to }) => <div>navigate to {to}</div>,
  Link: ({ children, ...rest }) => <a {...rest}>{children}</a>,
  useNavigate: () => () => {},
  useParams: () => ({}),
}));

// Mock axios to keep tests fast and deterministic.
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));



test('renders BlogHub hero title', () => {
  render(<App />);
  expect(screen.getByText(/BlogHub/i)).toBeInTheDocument();
});
