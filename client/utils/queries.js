import { gql } from '@apollo/client';

export const QUERY_ALLTHREADS = gql`
query AllThreads {
  allThreads {
    _id
    name
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