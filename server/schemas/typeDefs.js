const typeDefs = `
type User {
  _id: ID
  username: String
  email: String
  password: String
  threads: [Thread]!
}

type Thread {
  _id: ID
  name: String
  description: String
  comments: [Comment]!
}

type Comment {
  _id: ID
  author: String
  text: String
  likes: Int
  replies: [Reply]!
}

type Reply {
  _id: ID
  replyAuthor: String
  replyText: String
  likes: Int
}

type Auth {
  token: ID!
  user: User
}

type Query {
  users: [User]
  user(username: String!): User
  me: User
  allThreads: [Thread]
  ThreadById(_id: ID!): Thread
  allComments: [Comment]
  myThreads: [Thread]
  myComments: [Comment]
}

type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  addThread(description: String!, name: String!): Thread
  addThreadToUser(userId: ID!, threadId: ID!): Thread
  addComment(threadId: ID!, author: String!, text: String!): Comment
  addLikeToComment(threadId: ID!, commentId: ID!): Comment
  addReply(commentId: ID!, replyAuthor: String!, replyText: String!): Reply
  addLikeToReply(threadId: ID!, commentId: ID!, replyId: ID!): Reply
  removeThreadFromUser(threadId: ID!): Thread
}
`;

module.exports = typeDefs;