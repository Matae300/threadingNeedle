const { User, Thread, Comment } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate('threads');
    },
    user: async (parent, { username }) => {
      return await User.findOne({ username }).populate('threads');
    },
    allThreads: async () => {
      return await Thread.find();
    },
    allComments: async () => {
      return await Comment.find();
    },
    myThreads: async (parent, args, context) => {
      try {
        const user = await User.findById(context.user._id).populate('threads');
        if (!user) {
          throw new Error('User not found.');
        }

        return user.threads;
      } catch (error) {
        throw new Error(`Error fetching threads: ${error.message}`);
      }
    },
    myComments: async (parent, args, context) => {
      try {
        const user = await User.findById(context.user._id).populate('comments');
        if (!user) {
          throw new Error('User not found.');
        }

        return user.comments;
      } catch (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
      }
    },
    me: async (parent, args, context) => {
      try {
        const user = await User.findOne({ _id: context.user._id }).populate('threads');
        console.log("This is the user info", user);
        return user;
      } catch (error) {
        throw new Error(`Error fetching user info: ${error.message}`);
      }
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Invalid email or password');
      }

      const token = signToken(user);
      return { token, user };
    },
    addThread: async (parent, { name }) => {
      const thread = await Thread.create({ name });
      return thread;
    },
    addComment: async (parent, { threadId, author, text }) => {
      const updatedThread = await Thread.findOneAndUpdate(
         { _id: threadId },
         {
            $addToSet: {
               comments: { author, text },
            },
         },
         {
            new: true,
            runValidators: true,
         }
      );
      return updatedThread;
   },
   addReply: async (parent, { commentId, replyAuthor, replyText }) => {
    try {
      const thread = await Thread.findOneAndUpdate(
        { 'comments._id': commentId },
        {
          $push: { 'comments.$.replies': { replyAuthor, replyText } },
        },
        { new: true }
      );

      if (!thread) {
        throw new Error('Thread not found');
      }
      
      const updatedComment = thread.comments.find(comment => comment._id.toString() === commentId);
      return updatedComment;
    } catch (error) {
      throw new Error(`Error adding reply: ${error.message}`);
    }
  },
},
};

module.exports = resolvers;
