import { useQuery } from '@apollo/client';
import { QUERY_ALLTHREADS } from '../../utils/queries';

const Plants = ({ authToken }) => {
  const { loading: threadLoading, error: threadError, data: threadData } = useQuery(QUERY_ALLTHREADS, {
    context: { headers: { Authorization: `Bearer ${authToken}` } }, 
  });

  if (threadLoading) return <p>Loading...</p>;
  if (threadError) return <p>Error: {threadError.message}</p>;

  return (
    <div>
      <h3>Threads</h3>
      {threadData.allThreads.map((thread) => ( 
        <div key={thread._id} className="card">
          <div className="card-body bg-light p-2">
            <p>Name: {thread.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Plants;
