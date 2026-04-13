import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Layout/Header';

describe('Header (public)', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByAltText(/proconnect logo/i)).toBeInTheDocument();
  });

  it('renders login link', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText(/features/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
  });
});