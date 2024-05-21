import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_THREAD_BY_ID } from '../../utils/queries';

import AddComment from '../components/addComment'; 
import MyThreads from '../components/myThreads';
import AddReply from '../components/addReply'; 

import '../assets/Thread.css';

const ThreadDetails = ({ authToken }) => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(QUERY_THREAD_BY_ID, {
    variables: { id },
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const thread = data.ThreadById;

  const handleReplyClick = (commentId) => {
    setShowReplyForm((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleRepliesClick = (commentId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="thread-container">
      <h3>{thread.name}</h3>
      <p>{thread.description}</p>
      <AddComment threadId={thread._id} />
      {thread.comments.map((comment) => (
        <div key={comment._id} className="comment-card">
          <div className="comment-author">{comment.author}</div>
          <div className="comment-text">{comment.text}</div>
          <button className="reply-button">Like</button>
          <button className="reply-button" onClick={() => handleReplyClick(comment._id)}>
            {showReplyForm[comment._id] ? 'Cancel Reply' : 'Add Reply'}
          </button>
          {showReplyForm[comment._id] && (
            <div className="reply-form-container">
              <AddReply
                commentId={comment._id}
                threadId={thread._id}
                onReplyAdded={() => setShowReplyForm((prevState) => ({
                  ...prevState,
                  [comment._id]: false,
                }))}
              />
            </div>
          )}
          <button className="reply-button" onClick={() => handleRepliesClick(comment._id)}>
            {showReplies[comment._id] ? 'Hide Replies' : 'Show Replies'}
          </button>
          {showReplies[comment._id] && comment.replies.length > 0 && (
            <div className="mt-3 ml-3">
              <h5>Replies:</h5>
              {comment.replies.map((reply) => (
                <div key={reply._id} className="reply-card">
                  <div className="reply-author">{reply.replyAuthor}</div>
                  <div className="reply-text">{reply.replyText}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThreadDetails;