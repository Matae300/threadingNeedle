import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth'
import '../assets/Profile.css'

const Profile = () => {
  const authToken = Auth.getToken();
  const { loading: myLoading, error: myError, data: myData, refetch } = useQuery(QUERY_ME, {
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  if (myLoading) return <p>Loading...</p>;
  if (myError) return <p>Error: {myError.message}</p>;

  return (
    <div className="profile-container">
      {myData && myData.me && (
        <div>
          <h2>{myData.me.username}'s Profile</h2>

          <h3>Threads</h3>
          {myData.me.threads.map((thread) => (
            <div key={thread._id}>
              <div className='thread-div'>
                <Link to={`/thread/${thread._id}`} key={thread._id}>
                  <p>Name: {thread.name}</p>
                  <p>Description: {thread.description}</p>
                </Link>
              </div>

              <h3>Comments</h3>
              {thread.comments.map((comment) => (
                <div key={comment._id}>
                  <div className='comment-div'>
                    <p>Thread: {thread.name}</p>
                    <p>Comment: {comment.text}</p>
                  </div>

                  <h3>Replies</h3>
                  {comment.replies.map((reply) => (
                    <div key={reply._id}>
                      <div className='reply-div'>
                        <p>Reply Author: {reply.replyAuthor}</p>
                        <p>Reply Text: {reply.replyText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;