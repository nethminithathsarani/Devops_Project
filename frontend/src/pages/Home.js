import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4001';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/`);
        if (mounted) setPosts(res.data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load posts');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => { mounted = false };
  }, []);

  return (
    <div>
      <div className="card">
        <h2>Latest Posts</h2>
        {loading && <p>Loading posts…</p>}
        {error && <div className="message error">{error}</div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: '12px', marginTop: 12 }}>
            {posts.length === 0 && <div className="message">No posts yet.</div>}
            {posts.map(p => (
              <article key={p._id} className="card">
                <h3 style={{ margin: 0 }}>{p.title}</h3>
                {p.body && <p style={{ color: 'var(--muted)', marginTop: 8 }}>{p.body}</p>}
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8 }}>{new Date(p.createdAt).toLocaleString()}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
