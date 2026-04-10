import { render, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

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

  it('sets user after login', async () => {
    let value;
    render(
      <AuthProvider>
        <TestConsumer onValue={v => { value = v; }} />
      </AuthProvider>
    );
    act(() => {
      value.login({ name: 'Mohamed' }, 'fake-jwt-token');
    });
    expect(value.user).toEqual({ name: 'Mohamed' });
  });

  it('clears user after logout', () => {
    let value;
    render(
      <AuthProvider>
        <TestConsumer onValue={v => { value = v; }} />
      </AuthProvider>
    );
    act(() => value.logout());
    expect(value.user).toBeNull();
  });
});