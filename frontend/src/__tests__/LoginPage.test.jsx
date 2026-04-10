import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('axios', () => {
  const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  mockAxios.create.mockReturnValue(mockAxios);
  return { __esModule: true, default: mockAxios, ...mockAxios };
});

import LoginPage from '../pages/LoginPage';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const renderLogin = () => render(
  <MemoryRouter><LoginPage /></MemoryRouter>
);

// Target submit button specifically by type, not by name (two "Sign In" buttons exist)
const getSubmitButton = () =>
  screen.getByRole('button', { name: /signing in|sign in/i, hidden: false },)
  ?? screen.getAllByRole('button').find(b => b.type === 'submit');

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders sign in submit button', () => {
    renderLogin();
    const submitBtn = screen.getAllByRole('button').find(b => b.type === 'submit');
    expect(submitBtn).toBeInTheDocument();
  });

  it('renders create account link', () => {
    renderLogin();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  it('updates email field on input', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password field on input', () => {
    renderLogin();
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('toggles password visibility', () => {
    renderLogin();
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput.type).toBe('password');
    const toggleBtn = passwordInput.closest('div').querySelector('button');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
  });

  it('shows loading text while submitting', () => {
    renderLogin();
    // Fill form now to trigger submit (axios is mocked to hang, so loading state should persist)
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    // Click the actual submit button (type="submit"), not the tab button
    const submitBtn = screen.getAllByRole('button').find(b => b.type === 'submit');
    fireEvent.click(submitBtn);
    // After click, loading text should appear (axios is hanging — mock returns nothing)
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it('keep me logged in checkbox works', () => {
    renderLogin();
    const checkbox = screen.getByLabelText(/keep me logged in/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});