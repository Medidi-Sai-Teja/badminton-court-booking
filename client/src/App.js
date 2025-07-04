import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import BookingPage from './BookingPage';
import DisplayBookings from './DisplayBookings';
import AboutPage from './AboutPage';
import { useAuth } from './AuthContext';


const App = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Router>
      <div id="container">
        <header>
          <img src="./BATMINTON LOGO" alt="Badminton Logo" />
          <h1>BATMINTON COURT BOOKING SYSTEM</h1>

          <nav>
            <Link to="/">HOME</Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login">LOGIN</Link>
                <Link to="/signup">SIGNUP</Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={logout}>
                  LOGOUT
                </Link>
              </>
            )}
            <Link to="/about">ABOUT</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/displaybookings" element={<DisplayBookings />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
