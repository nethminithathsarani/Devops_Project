const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String },
  author: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
