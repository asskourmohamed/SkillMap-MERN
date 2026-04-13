import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock api service before AppHeader is imported (it pulls in axios transitively)
jest.mock('../services/api', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
  }
}));

import AppHeader from '../components/Layout/AppHeader';

const mockUser = { name: 'Mohamed', email: 'test@test.com', role: 'user' };
const mockAdmin = { name: 'Admin', email: 'admin@test.com', role: 'admin' };

const renderHeader = (user) => render(
  <MemoryRouter><AppHeader user={user} /></MemoryRouter>
);

describe('AppHeader', () => {
  it('renders without crashing', () => {
    renderHeader(mockUser);
    expect(screen.getByAltText(/proconnect logo/i)).toBeInTheDocument();
  });

  it('shows admin panel link for admin users', () => {
    renderHeader(mockAdmin);
    expect(screen.getByTitle(/administration/i)).toBeInTheDocument();
  });

  it('does not show admin panel for regular users', () => {
    renderHeader(mockUser);
    expect(screen.queryByTitle(/administration/i)).not.toBeInTheDocument();
  });

  it('opens dropdown and shows user name when avatar clicked', () => {
    renderHeader(mockUser);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(screen.getByText('Mohamed')).toBeInTheDocument();
  });

  it('shows logout button in dropdown', () => {
    renderHeader(mockUser);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(screen.getByText(/déconnexion/i)).toBeInTheDocument();
  });
});