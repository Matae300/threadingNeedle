
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const currentPage = useLocation().pathname;
  const logout = (event) => {
    event.preventDefault();
    
    Auth.logout();
    window.location.href = '/';
    
  };

  return (
    <>
<div className="navbarStyles w3-container no-padding">

  {/* nav links to add a plant, view tasks, and logout button */}
  <div className="nav-links navbarStyles w3-row w3-col s12 m6 l8 no-padding">

    <div className="w3-cell nav-item">
        <Link
          to="/"
          className={currentPage === '/' ? 'nav-link active' : 'nav-link'}>
          <p className="w3-btn w3-large btn-light">Main</p>
        </Link>
      </div>

      <div className="w3-cell nav-item">
        {/* <!--Replace '/' with route to the task list and calendar--> */}
        <Link
          to="/profile"
          className={currentPage === '/profile' ? 'nav-link active' : 'nav-link'} >
        <p className="w3-btn w3-large btn-light">Profile</p>
        </Link>
      </div>

      
      <div className="w3-cell nav-item">
        {/* <!--Replace '/' with route to the task list and calendar--> */}
        <Link
          to="/threads"
          className={currentPage === '/threads' ? 'nav-link active' : 'nav-link'} >
        <p className="w3-btn w3-large btn-light">My Threads</p>
        </Link>
      </div>

      <div className="w3-cell nav-item w3-margin-left">
        <button className="w3-btn w3-large btn-light">
        Login
        </button>
      </div>

    </div>

  </div>
</>
  );
}

export default Navbar;
