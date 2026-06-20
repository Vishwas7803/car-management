import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h1>🚗 Car Management</h1>
      {user && (
        <div className="nav-links">
          <span>Welcome, {user.name}!</span>
          <Link to="/products">Products</Link>
          <Link to="/create">Add Car</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
