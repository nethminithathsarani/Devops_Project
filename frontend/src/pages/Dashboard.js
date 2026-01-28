import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4001';

export default function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load posts');
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate('/login');
      return;
    }

    fetchPosts();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${API_BASE}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(post => post._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  return (
    <section className="dashboard">
      <header className="section__header">
        <div>
          <p className="section__eyebrow">Admin</p>
          <h2>Manage your posts</h2>
        </div>
        <Link to="/posts/create" className="cta__button cta__button--primary">Create Post</Link>
      </header>

      {loading && <p className="section__status">Loading posts…</p>}
      {error && <div className="message error">{error}</div>}

      {!loading && posts.length === 0 && <div className="message">No posts yet.</div>}

      {!loading && posts.length > 0 && (
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.updatedAt ? new Date(post.updatedAt).toLocaleString() : new Date(post.createdAt).toLocaleString()}</td>
                <td>
                  <div className="dashboard__actions">
                    <Link to={`/posts/${post._id}/edit`} className="table-action">Edit</Link>
                    <button type="button" className="table-action table-action--danger" onClick={() => handleDelete(post._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
