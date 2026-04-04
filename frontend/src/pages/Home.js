import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Use same-origin; Nginx proxies /api to backend in production.
const API_BASE = process.env.REACT_APP_API_URL || window.location.origin;
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/posts`);
        if (mounted) setPosts(res.data || []);
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.error || err.message || 'Failed to load posts');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => { mounted = false }; //test pipeline
  }, []);

  useEffect(() => {
    const syncAuth = () => setIsAdmin(Boolean(localStorage.getItem('token')));
    window.addEventListener('authchange', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('authchange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">BlogHub</p>
          <h1 className="hero__title">Welcome to BlogHub</h1>
          <p className="hero__subtitle">
            Discover insightful articles on technology, lifestyle, and personal growth. Join our
            community of curious minds and never miss an update.
          </p>
          <a className="hero__cta" href="#latest-posts">Read Blogs →</a>
        </div>
      </section>

      <section className="section" id="latest-posts">
        <header className="section__header">
          <div>
            <p className="section__eyebrow">Latest Posts</p>
            <h2>Check out our most recent articles</h2>
          </div>
          <a className="section__link" href="#all-posts">View All Posts</a>
        </header>

        {loading && <p className="section__status">Loading posts…</p>}
        {error && <div className="message error">{error}</div>}

        {!loading && !error && (
          <div className="posts-grid">
            {featuredPosts.length === 0 && <div className="message">No posts yet.</div>}
            {featuredPosts.map((post, index) => {
              const imageSrc = (post.imageUrl && post.imageUrl.trim()) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              return (
              <article key={post._id || index} className="post-card">
                <div className="post-card__media">
                  <img src={imageSrc} alt={post.title ? `Thumbnail for ${post.title}` : 'Blog post thumbnail'} loading="lazy" />
                </div>
                <div className="post-card__meta">
                  <span>{post.author || 'BlogHub Team'}</span>
                  <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'New'}</span>
                </div>
                <h3>{post.title}</h3>
                {post.body && <p>{post.body}</p>}
                <button type="button" className="post-card__button">Read More..</button>
              </article>
            );})}
          </div>
        )}

        {!loading && !error && posts.length > 3 && (
          <div className="all-posts" id="all-posts"> 
            <ul>
              {posts.slice(3).map(post => (
                <li key={post._id}>
                  <span>{post.title}</span>
                  <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="cta">
        <h2>Start Your Journey Today</h2>
        <p>
          Join thousands of readers who get inspired by our content. Subscribe to our newsletter and
          never miss an update.
        </p>
        <div className="cta__actions">
          {isAdmin ? (
            <Link className="cta__button cta__button--primary" to="/dashboard">Go to Dashboard</Link>
          ) : (
            <Link className="cta__button cta__button--primary" to="/login">Admin Login</Link>
          )}
          <a className="cta__button cta__button--secondary" href="#latest-posts">Learn More</a>
        </div>
      </section>
    </div>
  );
}
