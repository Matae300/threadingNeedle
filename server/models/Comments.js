const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  author: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: 'You need to leave a thought!',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  replies: [{
    replyAuthor: {
      type: String,
      required: true,
    },
    replyText: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  }],
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
