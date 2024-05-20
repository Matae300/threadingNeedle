import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADDREPLY } from '../../utils/mutations';
import { QUERY_THREAD_BY_ID, QUERY_ALLTHREADS } from '../../utils/queries';
import Auth from '../../utils/auth';


const AddReply = ({ commentId, threadId, onReplyAdded }) => {
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [addReply] = useMutation(ADDREPLY, {
    refetchQueries: [
      { query: QUERY_THREAD_BY_ID, variables: { id: threadId } },
      { query: QUERY_ALLTHREADS }
    ],
    errorPolicy: 'all',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!replyAuthor.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!replyText.trim()) {
      setError('Please enter a reply.');
      return;
    }

    try {
      await addReply({
        variables: {
          commentId,
          replyAuthor,
          replyText,
        },
      });

      setReplyAuthor('');
      setReplyText('');
      setError('');
      setSuccess(true);
      onReplyAdded(); // Call the callback to hide the form
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply. Please try again.');
      setSuccess(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'replyAuthor') {
      setReplyAuthor(value);
    } else if (name === 'replyText') {
      setReplyText(value);
    }
  };

  return (
    <div>
      {success && <div className="success-message">Reply added successfully!</div>}
      <form onSubmit={handleFormSubmit}>
        {error && <div className="error-message">{error}</div>}
        {Auth.loggedIn() ? (
          <div>
            <label htmlFor="replyAuthor">Author:</label>
            <input
              type="text"
              id="replyAuthor"
              name="replyAuthor"
              placeholder="Enter your name"
              value={replyAuthor}
              onChange={handleChange}
            />
            <label htmlFor="replyText">Reply:</label>
            <input
              type="text"
              id="replyText"
              name="replyText"
              placeholder="Enter your reply"
              value={replyText}
              onChange={handleChange}
            />
            <button type="submit">Add Reply</button>
          </div>
         ) : (
          <p>You need to be logged in to add a note. Please log in or sign up.</p>
        )}
      </form>
    </div>
  );
};

export default AddReply;
