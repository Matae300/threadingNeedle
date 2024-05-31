import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADDCOMMENT } from '../../utils/mutations';
import { QUERY_THREAD_BY_ID, QUERY_ALLTHREADS } from '../../utils/queries';
import Auth from '../../utils/auth';

const AddComment = ({ threadId }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const [addComment] = useMutation(ADDCOMMENT, {
    refetchQueries: [
      { query: QUERY_THREAD_BY_ID, variables: { id: threadId } },
      { query: QUERY_ALLTHREADS }
    ],
    errorPolicy: 'all',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!author.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!text.trim()) {
      setError('Please enter a comment.');
      return;
    }

    try {
      await addComment({
        variables: {
          threadId,
          author,
          text,
        },
      });

      setAuthor('');
      setText('');
      setError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'author') {
      setAuthor(value);
    } else if (name === 'text') {
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