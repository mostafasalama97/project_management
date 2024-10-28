import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders login form', () => {
  render(
    <AuthContext.Provider value={{ login: jest.fn() }}>
      <Router>
        <Login />
      </Router>
    </AuthContext.Provider>
  );

  expect(screen.getByText(/login/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
