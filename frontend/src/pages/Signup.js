import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4001';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
  await axios.post(`${API_BASE}/api/auth/signup`, { username: email, password });
  setMessage({ type: 'success', text: 'Signup successful — redirecting to login' });
  setName(''); setEmail(''); setPassword('');
  navigate('/login');
    } catch (err) {
      const text = err.response?.data?.error || err.response?.data?.message || 'Signup failed';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name" required />

        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />

        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />

        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
      </form>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}

export default Signup;

