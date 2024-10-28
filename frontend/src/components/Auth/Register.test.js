import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders register form', () => {
  render(
    <AuthContext.Provider value={{ login: jest.fn() }}>
      <Router>
        <Register />
      </Router>
    </AuthContext.Provider>
  );

  expect(screen.getByText(/register/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
});

test('allows user to input username, password, and select role', () => {
  render(
    <AuthContext.Provider value={{ login: jest.fn() }}>
      <Router>
        <Register />
      </Router>
    </AuthContext.Provider>
  );

  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const roleSelect = screen.getByLabelText(/role/i);

  fireEvent.change(usernameInput, { target: { value: 'newuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(roleSelect, { target: { value: 'Manager' } });

  expect(usernameInput.value).toBe('newuser');
  expect(passwordInput.value).toBe('password123');
  expect(roleSelect.value).toBe('Manager');
});
