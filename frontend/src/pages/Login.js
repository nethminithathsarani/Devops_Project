import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4001';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username: email, password });
      // store token if returned
      if (res.data && res.data.token) localStorage.setItem('token', res.data.token);
      setMessage({ type: 'success', text: 'Login successful' });
      // redirect to home
      navigate('/');
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
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email or username" required />

        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />

        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}

export default Login;
