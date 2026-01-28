const express = require('express');
const Post = require('../models/Post');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts - list posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, body, imageUrl } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const post = new Post({
      title,
      body,
      imageUrl,
      author: process.env.ADMIN_DISPLAY_NAME || req.admin.username
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/posts/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, body, imageUrl } = req.body;
    if (title === undefined && body === undefined && imageUrl === undefined) {
      return res.status(400).json({ error: 'Nothing to update' });
    }
    const update = { author: process.env.ADMIN_DISPLAY_NAME || req.admin.username };
    if (title !== undefined) update.title = title;
    if (body !== undefined) update.body = body;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
