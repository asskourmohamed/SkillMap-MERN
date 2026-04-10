import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/layout/Header';

describe('Header (public)', () => {
  it('renders login link', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});