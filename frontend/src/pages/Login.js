import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username || username);
        window.dispatchEvent(new Event('authchange'));
      }
      setMessage({ type: 'success', text: 'Login successful — redirecting to dashboard' });
      navigate('/dashboard');
    } catch (err) {
      const text = err.response?.data?.error || 'Login failed';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Admin Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Enter admin username" required />

        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter admin password" required />

        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}

export default Login;
