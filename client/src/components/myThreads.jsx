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


  return (
    <div className="sidenav">
      <h3>My Threads</h3>

    </div>
  );
};

export default MyThreads;
