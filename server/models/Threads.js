const { Schema, model } = require('mongoose');

const threadSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Thread = model('Thread', threadSchema);

module.exports = Thread;
