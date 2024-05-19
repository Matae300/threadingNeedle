const { User, Threads, Comments } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
       let userinfo =  await User.findOne({ _id: context.user._id }).populate('threads');
        console.log("This is the user info", userinfo );
        return userinfo;
      }

      throw new Error('You must be logged in to access this data.');;
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
       addThread: async (parent, { name }, context) => {
      if (context.user) {
        const thread = await Threads.create({ name });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { threads: thread._id } }
        );

        return thread;
      }
      throw AuthenticationError;
    },
    addComment: async (parent, { threadId, author, text}, context) => {
      if (context.user) {
        const updatedThread = await Threads.findOneAndUpdate(
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
      }
      throw AuthenticationError;
    },
    addReply: async (parent, { commentId, replyAuthor, replyText}, context) => {
      if (context.user) {
        const updatedComment = await Comments.findOneAndUpdate(
          { _id: commentId },
          {
            $addToSet: {
              replies: { author: replyAuthor, text: replyText },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return updatedComment;
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
  