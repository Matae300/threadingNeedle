import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ALLTHREADS } from '../../utils/queries';

import '../assets/Home.css';

const Home = ({ authToken }) => {
  const { loading: threadLoading, error: threadError, data: threadData } = useQuery(QUERY_ALLTHREADS, {
    context: { headers: { Authorization: `Bearer ${authToken}` } }, 
  });

  if (threadLoading) return <p>Loading...</p>;
  if (threadError) return <p>Error: {threadError.message}</p>;

  return (
    <div className="tilesContainer">
      {threadData.allThreads.map((thread) => (
        <div className="tilesWrap" key={thread._id}>
          <Link to={`/thread/${thread._id}`}>
            <ul>
              <li>
                <h3>{thread.name}</h3>
                <h3>{thread.description}</h3>
                <button>See Thread</button>
              </li>
            </ul>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
