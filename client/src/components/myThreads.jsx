import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import '../assets/myThread.css';

const MyThreads = ({ authToken }) => {
  const { loading: myLoading, error: myError, data: myData } = useQuery(QUERY_ME, {
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  if (myLoading) return <p>Loading...</p>;
  if (myError) return <p>Error: {myError.message}</p>;

  const { me } = myData;


  const { allThreads } = me;

  return (
    <div className="sidenav">
      <h3>My Threads</h3>
      {allThreads.length === 0 ? (
        <p>No threads yet</p>
      ) : (
        allThreads.map((thread) => (
          <Link to={`/thread/${thread._id}`} key={thread._id}>
            <div className="card">
              <div className="card-body bg-light p-2">
                <p className="card-title">{thread.name}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default MyThreads;
