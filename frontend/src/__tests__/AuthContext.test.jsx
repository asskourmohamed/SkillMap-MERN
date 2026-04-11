import { render, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

// localStorage is available in jsdom 
beforeEach(() => {
  localStorage.clear();
});

const TestConsumer = ({ onValue }) => {
  const ctx = useContext(AuthContext);
  onValue(ctx);
  return null;
};

describe('AuthContext', () => {
  it('provides null user initially', () => {
    let value;
    render(
      <AuthProvider>
        <TestConsumer onValue={v => { value = v; }} />
      </AuthProvider>
    );
    expect(value.user).toBeNull();
  });

  it('sets user after login', () => {
    let value;
    render(
      <AuthProvider>
        <TestConsumer onValue={v => { value = v; }} />
      </AuthProvider>
    );
    act(() => {
      value.login({ name: 'Mohamed', email: 'test@test.com' }, 'fake-jwt');
    });
    expect(value.user).toEqual({ name: 'Mohamed', email: 'test@test.com' });
    expect(localStorage.getItem('token')).toBe('fake-jwt');
  });

  it('clears user after logout', () => {
    let value;
    render(
      <AuthProvider>
        <TestConsumer onValue={v => { value = v; }} />
      </AuthProvider>
    );
    act(() => {
      value.login({ name: 'Mohamed' }, 'fake-jwt');
    });
    act(() => {
      value.logout();
    });
    expect(value.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Restored User' }));
    let value;
    render(
      <AuthProvider>
        <TestConsumer onValue={v => { value = v; }} />
      </AuthProvider>
    );
    expect(value.user).toEqual({ name: 'Restored User' });
  });
});