import { gql } from '@apollo/client';

export const ADDTHREAD = gql`
mutation AddThread($name: String!) {
  addThread(name: $name) {
    _id
    name
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

export const ADDUSER = gql`
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

export const LOGIN = gql`
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