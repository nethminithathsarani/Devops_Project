import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

export default function PostEditor({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(mode === 'edit');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle(res.data.title || '');
        setBody(res.data.body || '');
        setImageUrl(res.data.imageUrl || '');
      } catch (err) {
        setStatus({ type: 'error', text: err.response?.data?.error || 'Unable to load post' });
      } finally {
        setLoading(false);
      }
    };

    if (mode === 'edit' && id) {
      fetchPost();
    }
  }, [id, mode, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    if (!title.trim()) {
      setStatus({ type: 'error', text: 'Title is required' });
      return;
    }

    try {
      const payload = { title, body, imageUrl: imageUrl || undefined };
      const headers = { Authorization: `Bearer ${token}` };
      if (mode === 'edit' && id) {
        await axios.put(`${API_BASE}/api/posts/${id}`, payload, { headers });
        setStatus({ type: 'success', text: 'Post updated successfully' });
      } else {
        await axios.post(`${API_BASE}/api/posts`, payload, { headers });
        setStatus({ type: 'success', text: 'Post created successfully' });
        setTitle('');
        setBody('');
        setImageUrl('');
      }
      navigate('/dashboard');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Failed to save post' });
    }
  };

  return (
    <section className="composer">
      <header className="section__header">
        <div>
          <p className="section__eyebrow">Admin</p>
          <h2>{mode === 'edit' ? 'Edit Post' : 'Create Post'}</h2>
        </div>
      </header>
      {loading ? (
        <p className="section__status">Loading post…</p>
      ) : (
        <form className="composer__form" onSubmit={handleSubmit}>
          <div className="composer__field">
            <label htmlFor="title">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
          </div>
          <div className="composer__field">
            <label htmlFor="body">Body</label>
            <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Write your post content here" />
          </div>
          <div className="composer__field">
            <label htmlFor="imageUrl">Thumbnail Image URL</label>
            <input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
          <div className="composer__actions">
            <button type="submit" className="cta__button cta__button--primary">{mode === 'edit' ? 'Update Post' : 'Publish Post'}</button>
            <button type="button" className="cta__button cta__button--secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
          {status && <div className={`message ${status.type}`}>{status.text}</div>}
        </form>
      )}
    </section>
  );
}
