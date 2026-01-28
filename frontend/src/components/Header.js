import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('token')));
    window.addEventListener('authchange', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('authchange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('authchange'));
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="brand"><Link to="/" style={{ textDecoration: 'none', color: 'var(--accent)' }}>BlogHub</Link></div>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/posts/create">Create Post</Link>
            <button type="button" onClick={handleLogout} className="nav-button">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
