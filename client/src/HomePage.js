import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import { useAuth } from './AuthContext';

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div>

      {/* Main Section */}
      <main id='home-main'>
        {/* About Badminton */}
        <div>
          <h2>About Badminton</h2>
          <p>Short one-line information about badminton.</p>
        </div>

        {/* Background Image */}
        <div>
          <img src="badminton_court_bg.jpg" alt="Badminton Court Background" />
        </div>

        {/* Book Now Button */}
        <div>
        {isLoggedIn ? (
        <Link to="/booking">
          <button>Book Now</button>
        </Link>
      ) : (
        <Link to="/login">
          <button>Login to Book Now</button>
        </Link>
      )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
