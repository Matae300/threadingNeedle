const { User, Thread } = require('../models');
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
    ThreadById: async (parent, { _id }) => {  
      console.log("This is the id", _id);
      return await Thread.findOne({ _id }).populate('comments');  
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
      if (context.user) {
       let userinfo =  await User.findOne({ _id: context.user._id }).populate('threads');
        console.log("This is the user info", userinfo );
        return userinfo;
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
    addThread: async (parent, { name, description }, context) => {
      if (context.user) {
        const thread = await Thread.create({ name, description });
        
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { threads: thread._id } }
        );

        return thread;
      }
      throw new Error('You must be logged in to add a thread.');
    },
    addThreadToUser: async (_, { userId, threadId }, context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
    
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
    
      const alreadyAdded = user.threads.some(pid => pid.equals(threadId));
      if (alreadyAdded) {
        throw new Error('Thread already added to the user');
      }
    
      const thread = await Thread.findById(threadId);
      if (!thread) throw new Error('Thread not found');
    
      user.threads.push(thread._id);
      await user.save();
    
      return thread;
    },
    addComment: async (parent, { threadId, author, text }, context) => {
      if (context.user) {
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
      }
      throw new Error('You must be logged in to add a comment.');
    },
    addReply: async (parent, { commentId, replyAuthor, replyText }, context) => {
      if (context.user) {
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
      } else {
        throw new Error('You must be logged in to add a reply.');
      }
    },
    addLikeToComment: async (_, { threadId, commentId }) => {
      try {
        const thread = await Thread.findById(threadId);
        if (!thread) {
          throw new Error("Thread not found");
        }
        const comment = thread.comments.id(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }

        comment.likes += 1;
        await thread.save();
        return comment;
      } catch (error) {
        throw new Error(error);
      }
    },
    addLikeToReply: async (_, { threadId, commentId, replyId }) => {
      try {
        const thread = await Thread.findById(threadId);
        if (!thread) {
          throw new Error("Thread not found");
        }
        const comment = thread.comments.id(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }
        const reply = comment.replies.id(replyId);
        if (!reply) {
          throw new Error("Reply not found");
        }

        reply.likes += 1;
        await thread.save();
        return reply;
      } catch (error) {
        throw new Error(error);
      }
    },
    removeThreadFromUser: async (parent, { threadId }, context) => {
      if (context.user) {
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { threads: threadId } }
        );

        const thread = await Thread.findById(threadId);
        return thread;
      }
      throw new AuthenticationError('You must be logged in to remove a thread.');
    },
  }
};

module.exports = resolvers;