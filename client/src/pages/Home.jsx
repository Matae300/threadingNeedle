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
      <h1 className="title">Threads</h1>
      {threadData.allThreads.map((thread) => (
        <div className="tilesWrap" key={thread._id}>
          <Link to={`/thread/${thread._id}`} className="tile-link">
            <ul className="tile-list">
              <li className="tile-item">
                <h3 className="tile-name">{thread.name}</h3>
                <p className="tile-description">{thread.description}</p>
                <button className="tile-button">See Thread</button>
              </li>
            </ul>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;