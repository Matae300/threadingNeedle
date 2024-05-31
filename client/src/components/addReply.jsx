import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADDREPLY } from '../../utils/mutations';
import { QUERY_THREAD_BY_ID, QUERY_ALLTHREADS, QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';


const AddReply = ({ commentId, threadId, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: userData } = useQuery(QUERY_ME);

  const [addReply] = useMutation(ADDREPLY, {
    refetchQueries: [
      { query: QUERY_THREAD_BY_ID, variables: { id: threadId } },
      { query: QUERY_ALLTHREADS }
    ],
    errorPolicy: 'all',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!replyText.trim()) {
      setError('Please enter a reply.');
      return;
    }

    try {
      await addReply({
        variables: {
          commentId,
          replyAuthor: userData?.me?.username,
          replyText,
        },
      });

      setReplyText('');
      setError('');
      setSuccess(true);
      onReplyAdded(); 
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply. Please try again.');
      setSuccess(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'replyText') {
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
