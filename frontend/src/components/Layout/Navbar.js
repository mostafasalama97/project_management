import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/projects">Projects</Link>
      {auth.user && auth.user.role === 'Manager' && <Link to="/projects/new">Add Project</Link>}
      {auth.user && auth.user.role === 'Manager' && <Link to="/tasks/new">Add Task</Link>}
      {auth.token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
