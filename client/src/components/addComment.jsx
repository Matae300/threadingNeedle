import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADDCOMMENT } from '../../utils/mutations';
import { QUERY_THREAD_BY_ID, QUERY_ALLTHREADS, QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';

const AddComment = ({ threadId }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const { data: userData } = useQuery(QUERY_ME);

  const [addComment] = useMutation(ADDCOMMENT, {
    refetchQueries: [
      { query: QUERY_THREAD_BY_ID, variables: { id: threadId } },
      { query: QUERY_ALLTHREADS }
    ],
    errorPolicy: 'all',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setError('The field is required and cannot be empty');
      return;
    }

    try {
      await addComment({
        variables: {
          threadId,
          author: userData?.me?.username,
          text,
        },
      });

      setText('');
      setError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'text') {
        setText(value);
      }
    };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        {error && <div className="error-message">{error}</div>}
        {Auth.loggedIn() && (
          <>
            <input
              type="text"
              id="text"
              name="text"
              placeholder="Add a comment"
              value={text}
              onChange={handleChange}
            />
            <button type="submit">Comment</button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddComment;