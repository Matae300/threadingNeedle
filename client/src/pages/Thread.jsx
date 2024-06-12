import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_THREAD_BY_ID, QUERY_ME } from '../../utils/queries';
import { ADDTHREADTOUSER, ADDLIKEREPLY, ADDLIKECOMMENT } from '../../utils/mutations';
import AddComment from '../components/addComment'; 
import AddReply from '../components/addReply'; 
import Auth from '../../utils/auth'

import '../assets/Thread.css';

const ThreadDetails = ({ authToken }) => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_THREAD_BY_ID, {
    variables: { id },
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  const { loading: userLoading, error: userError, data: userData } = useQuery(QUERY_ME, {
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const [addThreadToUser] = useMutation(ADDTHREADTOUSER);
  const [addLikeComment] = useMutation(ADDLIKECOMMENT);
  const [addLikeReply] = useMutation(ADDLIKEREPLY);

  if (loading || userLoading) return <p>Loading...</p>;
  if (error || userError) return <p>Error: {error?.message || userError?.message}</p>;

  const thread = data?.ThreadById;
  const userId = userData?.me?._id;

  const handleAddThread = async () => {
    try {
      await addThreadToUser({ variables: { userId, threadId: id } });
      console.log('Thread added successfully');
    } catch (err) {
      console.error(err);
      console.log('Error adding thread: ' + err.message);
    }
  };

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

  const handleLikeComment = async (commentId) => {
    if (!Auth.loggedIn()) {
      setErrorMessage('You must be signed in to like a comment.');
      setTimeout(() => setErrorMessage(''), 5000);
      return; 
    }

    try {
      await addLikeComment({ variables: { userId, threadId: id, commentId } });
      console.log('Comment liked successfully');
    } catch (err) {
      console.error(err);
      console.log('Error liking comment: ' + err.message);
    }
  };

  const handleLikeReply = async (replyId, commentId) => {
    if (!Auth.loggedIn()) {
      setErrorMessage('You must be signed in to like a reply.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      await addLikeReply({ variables: { userId, threadId: id, commentId, replyId } });
      console.log('Reply liked successfully');
    } catch (err) {
      console.error(err);
      console.log('Error liking reply: ' + err.message);
    }
  };

  if (!thread) return <p>No thread found</p>;

  const threadAdded = userData?.me?.threads?.find((thread) => thread._id === id);

  return (
    <div className="thread-container">
      {userId && <button className='add-button' onClick={handleAddThread}>Add Thread</button>}
      {userId && threadAdded && <p>You have already added this thread.</p>}
      <h2 className='threadname'>{thread.name}</h2>
      <p className='threadname'>{thread.description}</p>
      <AddComment threadId={thread._id} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {thread.comments.length === 0 && <p className='threadname'>No comments yet</p>}
      {thread.comments.map((comment) => (
        <div key={comment._id} className="comment-card">
          <div className="comment-author">{comment.author}</div>
          <div className="comment-text">{comment.text}</div>
          <button className="reply-button" onClick={() => handleLikeComment(comment._id)}>👍🏻 {comment.likes}</button>
          <button className="reply-button" onClick={() => handleReplyClick(comment._id)}>
            {showReplyForm[comment._id] ? 'Cancel Reply' : 'Add Reply'}
          </button>
          {showReplies[comment._id] ? (
            <button className="reply-button" onClick={() => handleRepliesClick(comment._id)}>
              Hide Replies
            </button>
          ) : (
            <button className="reply-button" onClick={() => handleRepliesClick(comment._id)}>
              Show Replies
            </button>
          )}
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
          {showReplies[comment._id] && comment.replies.length > 0 && (
            <div className="mt-3 ml-3">
              <h4>Replies:</h4>
              {comment.replies.map((reply) => (
                <div key={reply._id} className="reply-card ml-3">
                  <div className="reply-author">{reply.replyAuthor}</div>
                  <div className="comment-author">@ {comment.author}</div>
                  <div className="reply-text">{reply.replyText}</div>
                  <button className="reply-button" onClick={() => handleLikeReply(reply._id, comment._id)}>👍🏻 {reply.likes}</button>
                  <button className="reply-button" onClick={() => handleReplyClick(reply._id)}>
                    {showReplyForm[reply._id] ? 'Cancel Reply' : 'Add Reply'}
                  </button>
                  {showReplyForm[reply._id] && (
                    <div className="reply-form-container">
                      <AddReply
                        commentId={comment._id}
                        replyId={reply._id}
                        threadId={thread._id}
                        onReplyAdded={() => setShowReplyForm((prevState) => ({
                          ...prevState,
                          [reply._id]: false,
                        }))}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {showReplies[comment._id] && comment.replies.length === 0 && (
            <p>No replies yet</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThreadDetails;