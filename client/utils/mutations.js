import { gql } from '@apollo/client';

export const QUERY_ADDTHREAD = gql`
mutation AddThread($name: String!) {
  addThread(name: $name) {
    _id
    name
  }
}`;

export const QUERY_ADDCOMMENT = gql`
mutation AddComment($threadId: ID!, $author: String!, $text: String!) {
  addComment(threadId: $threadId, author: $author, text: $text) {
    _id
    author
    text
  }
}`;

export const QUERY_ADDREPLY = gql`
mutation AddReply($commentId: ID!, $replyAuthor: String!, $replyText: String!) {
  addReply(commentId: $commentId, replyAuthor: $replyAuthor, replyText: $replyText) {
    _id
    replyAuthor
    replyText
  }
}`;

export const QUERY_ADDUSER = gql`
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

export const QUERY_LOGIN = gql`
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