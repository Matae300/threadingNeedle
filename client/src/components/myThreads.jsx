import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";

import { QUERY_ME } from '../../utils/queries';
import { REMOVETHREADFROMUSER } from '../../utils/mutations';

import AddThread from './addThread';
import Auth from '../../utils/auth';

import '../assets/myThread.css';

const MyThreads = () => {
  const [showForm, setShowForm] = useState(false);

  const [removeThread] = useMutation(REMOVETHREADFROMUSER);

  const authToken = Auth.getToken();
  const { loading: myLoading, error: myError, data: myData, refetch } = useQuery(QUERY_ME, {
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  const handleRemoveThread = async (threadId) => {
    try {
      await removeThread({ variables: { threadId } });
      console.log('Thread removed successfully');
    } catch (err) {
      console.error(err);
      console.log('Error removing thread: ' + err.message);
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); 
    }, 500); 

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refetch]);

  if (myLoading) return <p>Loading...</p>;
  if (myError) return <p>Error: {myError.message}</p>;

  const threads = myData?.me?.threads || [];

  const toggleForm = () => {
    setShowForm((prev) => !prev); 
  };

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
                  <div className="mythread">
                    <p className='remove-thread-button' onClick={() => handleRemoveThread(thread._id)}>🚮</p>
                    <p className="card-title">{thread.name}</p>
                  </div>
                </div>
              </Link>
            ))
          )}

          <button
            style={{
              padding: '8px 12px',
              backgroundColor: '#0048bdb6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              marginBottom: '20px',
            }}
            onClick={toggleForm}
          >
            Add Thread +
          </button>
          <br />
          {showForm && <AddThread />}
        </>
      ) : (
        <p className='error-p'>You need to be logged in to view or add threads. Please log in or sign up.</p>
      )}
    </div>
  );
};

export default MyThreads;