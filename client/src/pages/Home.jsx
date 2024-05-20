import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ALLTHREADS } from '../../utils/queries';

import AddThread from '../components/addThread'; 
import MyThreads from '../components/myThreads';

import Signup from '../components/Signup';
import Login from '../components/Login';

import '../assets/Home.css';

const Home = ({ authToken }) => {
  const [showForm, setShowForm] = useState(false); 

  const { loading: threadLoading, error: threadError, data: threadData } = useQuery(QUERY_ALLTHREADS, {
    context: { headers: { Authorization: `Bearer ${authToken}` } }, 
  });

  if (threadLoading) return <p>Loading...</p>;
  if (threadError) return <p>Error: {threadError.message}</p>;

  const toggleForm = () => {
    setShowForm((prev) => !prev); 
  };

  return (
    <div>
      <div>
        <Signup />
      </div>
  
      <div>
        <Login />
      </div>
  
      <div className="card-container">
        <h3>Threads</h3>
        {showForm && <AddThread />} 
        <button onClick={toggleForm}>Add Thread +</button>
        {threadData.allThreads.map((thread) => (
          <Link to={`/thread/${thread._id}`} key={thread._id}>
            <div className="card">
              <div className="card-body bg-light p-2">
                <p className="card-title">{thread.name}</p>
                <p>{thread.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
