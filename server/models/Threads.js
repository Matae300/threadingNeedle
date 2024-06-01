const { Schema, model } = require('mongoose');

const replySchema = new Schema({
  replyAuthor: {
    type: String,
    required: true,
    trim: true,
  },
  replyText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const commentSchema = new Schema({
  author: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  replies: [replySchema],
});

const threadSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 100,
    unique: true,
    trim: true,
  },
  comments: [commentSchema],
});

const Thread = model('Thread', threadSchema);

module.exports = Thread;
