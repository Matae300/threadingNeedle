import { gql } from '@apollo/client';

export const ADDTHREAD = gql`
mutation AddThread($name: String!, $description: String!) {
  addThread(name: $name, description: $description) {
    _id
    name
    description
  }
}`;

export const ADDTHREADTOUSER = gql`
mutation AddThreadToUser($userId: ID!, $threadId: ID!) {
  addThreadToUser(userId: $userId, threadId: $threadId) {
    _id
    name
    description
  }
}`;

export const REMOVETHREADFROMUSER = gql`
mutation RemoveThreadFromUser($threadId: ID!) {
  removeThreadFromUser(threadId: $threadId) {
    _id
    name
    description

  }
}`;

export const ADDLIKECOMMENT = gql`
mutation AddLikeToComment($threadId: ID!, $commentId: ID!) {
  addLikeToComment(threadId: $threadId, commentId: $commentId) {
    _id
    likes
  }
}`;

export const ADDLIKEREPLY = gql`
mutation AddLikeToReply($threadId: ID!, $commentId: ID!, $replyId: ID!) {
  addLikeToReply(threadId: $threadId, commentId: $commentId, replyId: $replyId) {
    _id
    likes
  }
}`;

export const ADDCOMMENT = gql`
mutation AddComment($threadId: ID!, $author: String!, $text: String!) {
  addComment(threadId: $threadId, author: $author, text: $text) {
    _id
    author
    text
  }
}`;

export const ADDREPLY = gql`
mutation AddReply($commentId: ID!, $replyAuthor: String!, $replyText: String!) {
  addReply(commentId: $commentId, replyAuthor: $replyAuthor, replyText: $replyText) {
    _id
    replyAuthor
    replyText
  }
}`;

export const ADD_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      email
      password
      username
    }
  }
}`;

export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      password
    }
  }
}`;