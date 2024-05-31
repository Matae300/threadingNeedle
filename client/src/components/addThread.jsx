import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADDTHREAD } from '../../utils/mutations';
import { QUERY_THREAD_BY_ID, QUERY_ALLTHREADS } from '../../utils/queries';

import Auth from '../../utils/auth';
import '../assets/addThread.css'

const AddThread = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [addThread] = useMutation(ADDTHREAD, {
    refetchQueries: [
      { query: QUERY_THREAD_BY_ID },
      { query: QUERY_ALLTHREADS }
    ],
    errorPolicy: 'all',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Please enter name.');
      return;
    }

    try {
      await addThread({
        variables: {
          name,
          description,
        },
      });

      setName('');
      setDescription('');
      setError('');
      setSuccess(true);
    } catch (err) {
      console.error('Error adding thread:', err);
      setError('Failed to add thread. Please try again.');
      setSuccess(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value); 
    } else if (name === 'description') {
      setDescription(value); 
    }
  };

  return (
    <div>
      {success && <div className="success-message">Thread added successfully!</div>}
      <form className='addThread-form' onSubmit={handleFormSubmit}>
        {error && <div className="error-message">{error}</div>}
        {Auth.loggedIn() ? (
          <>
            <label className='addThread-label' htmlFor="name">name:</label>
            <input className='addThread-input'
              type="text"
              id="name"
              name="name"
              placeholder="Enter name"
              value={name}
              onChange={handleChange}
            />
            <label className='addThread-label' htmlFor="description">description:</label>
            <textarea className='addThread-textarea'
              type="text"
              id="description"
              name="description"
              placeholder="Enter description..."
              value={description}
              onChange={handleChange}
            />
            <button className='addThread-button' type="submit">Submit</button>
          </>
        ) : (
          <p>You need to be logged in to add a note. Please log in or sign up.</p>
        )}
      </form>
    </div>
  );
};

export default AddThread;
