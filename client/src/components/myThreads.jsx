import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { useEffect } from "react";

import { QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

import '../assets/myThread.css';

const MyThreads = () => {
  const authToken = Auth.getToken();
  const { loading: myLoading, error: myError, data: myData, refetch } = useQuery(QUERY_ME, {
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Refetch data every second
    }, 1000); // 1000 milliseconds = 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refetch]);

  if (myLoading) return <p>Loading...</p>;
  if (myError) return <p>Error: {myError.message}</p>;

  const threads = myData?.me?.threads || [];

  return (
    <div className="sidenav">
      <h3>My Threads</h3>
      {Auth.loggedIn() ? (
        <>
          {threads.length === 0 ? (
            <p>No threads yet</p>
          ) : (
            threads.map((thread) => (
              <Link to={`/thread/${thread._id}`} key={thread._id}>
                <div className="card">
                  <div className="card-body bg-light p-2">
                    <p className="card-title">{thread.name}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </>
      ) : (
        <p>You need to be logged in to view your threads. Please log in or sign up.</p>
      )}
    </div>
  );
};

export default MyThreads;