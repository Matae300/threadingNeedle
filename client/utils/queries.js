import { gql } from '@apollo/client';

export const QUERY_ALLTHREADS = gql`
query AllThreads {
  allThreads {
    _id
    name
    description
    comments {
      _id
      author
      text
      replies {
        _id
        replyAuthor
        replyText
      }
    }
  }
}
`;

export const QUERY_THREAD_BY_ID = gql`
query ThreadById($id: ID!) {
  ThreadById(_id: $id) {
    _id
    name
    description
    comments {
      _id
      author
      text
      replies {
        _id
        replyAuthor
        replyText
      }
    }
  }
}
`;