import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADDTHREAD } from '../../utils/mutations';
import { QUERY_THREAD_BY_ID, QUERY_ALLTHREADS } from '../../utils/queries';

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
      <form onSubmit={handleFormSubmit}>
        {error && <div className="error-message">{error}</div>}
        <label htmlFor="name">name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name"
          value={name}
          onChange={handleChange}
        />
        <label htmlFor="description">description:</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Enter description..."
          value={description}
          onChange={handleChange}
        />
        <button type="submit">Add Thread</button>
      </form>
    </div>
  );
};

export default AddThread;