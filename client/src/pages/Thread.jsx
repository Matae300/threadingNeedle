import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_THREAD_BY_ID } from '../../utils/queries';
import AddComment from '../components/addComment';

import '../assets/Thread.css';

const ThreadDetails = ({ authToken }) => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(QUERY_THREAD_BY_ID, {
    variables: { id },
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const thread = data.ThreadById;

  return (
    <div>
      <h3>{thread.name}</h3>
      <AddComment threadId={thread._id} />
      {thread.comments.map((comment) => (
        <div key={comment._id} className="card my-2">
          <div className="card-body bg-light p-2">
            <p><strong>{comment.author}</strong></p>
            <p>{comment.text}</p>
            <button>Like</button>
            <button>Add Reply</button>
            {comment.replies.length > 0 && (
              <div className="mt-3 ml-3">
                <h5>Replies:</h5>
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="card my-1">
                    <div className="card-body p-2">
                      <p><strong>{reply.replyAuthor}</strong>: {reply.replyText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadDetails;
