const typeDefs = `
type User {
  _id: ID
  username: String
  email: String
  password: String!
  threads: [Thread]!
  comments: [Comment]!
}

type Thread {
  _id: ID!
  name: String!
  comments: [Comment]!
}

type Comment {
  _id: ID!
  author: String!
  text: String!
  createdAt: String!
  replies: [Reply]!
}

type Reply {
  _id: ID!
  replyAuthor: String!
  replyText: String!
  createdAt: String!
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
  allComments: [Comment]
  allReplies: [Reply]
  myThreads: [Thread]
  myComments: [Comment]
  myReplies: [Reply]
}

type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  addThread(name: String!): Thread
  addComment(threadId: ID!, author: String!, text: String!): Comment
  addReply(commentId: ID!, replyAuthor: String!, replyText: String!): Reply
}
`;

module.exports = typeDefs;