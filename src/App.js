import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer'; // Import the Footer component
import Login from './components/Login';
import SignUp from './components/SignUp';
import FeedbackForm from './components/FeedbackForm';
import OrderList from './components/OrderList';
import { DotLoader } from 'react-spinners';
import ResetPassword from './components/ResetPassword';
import OrderTable from './components/OrderTable';

import './App.css';

const App = () => {
  // State variables to manage user authentication and loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [inactiveTime, setInactiveTime] = useState(0); // Track inactive time
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(30); // Initial countdown value
  const [lastActiveTime, setLastActiveTime] = useState(Date.now()); // Track last active time
  const timerRef = useRef(null);



  // Function to handle user login
  const handleLogin = (token) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token); // Set access token received from login
    setIsLoggedIn(true); // Set isLoggedIn state to true
    resetInactiveTime();
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null); // Clear access token
    setIsLoggedIn(false); // Set isLoggedIn state to false
    resetInactiveTime();
    setShowCountdown(false); // Hide the countdown on logout
  };

// Function to reset inactive time and update last active time
const resetInactiveTime = () => {
  setInactiveTime(0);
  setLastActiveTime(Date.now());
};

  // Effect hook to check token expiration and handle logout if token is expired
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsLoggedIn(true);
    }

    const checkTokenExpiration = async () => {
      if (!accessToken) return; // If there's no access token, return

      try {
        // Validate the access token by sending a request to the server
        const response = await fetch('http://192.168.111.170/johnsonweb/api/tokenValidation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          handleLogout(); // If the token is not valid, logout the user
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setTokenError('Error validating token'); // Set token error state if validation fails
      } finally {
        setIsLoading(false); // Set loading state to false after validation
      }

      // Check if the token has expired
      const tokenExp = decodeToken(accessToken).exp;
      if (Date.now() >= tokenExp * 1000) {
        handleLogout(); // Logout the user if the token has expired
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check token expiration every minute
    return () => clearInterval(interval); // Cleanup function to clear the interval on component unmount
  }, [accessToken]); // Run the effect whenever the access token changes

  // Effect hook to track inactive time
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const inactiveDuration = currentTime - lastActiveTime;
      if (inactiveDuration >= 60000) { // Check if 1 minute has passed since last activity
        setShowCountdown(true); // Show the countdown if inactive for 1 minute
      }
      setInactiveTime(inactiveDuration / 1000); // Convert inactive duration to seconds
    }, 1000); // Check inactivity every second
    timerRef.current = interval;
    return () => clearInterval(timerRef.current); // Cleanup function to clear the interval on component unmount
  }, [lastActiveTime]);

// Event listener to reset inactive time on user activity
useEffect(() => {
  const activityListener = () => {
    resetInactiveTime(); // Reset inactive time on user activity
  };
  document.addEventListener('click', activityListener); // Listen for click events
  document.addEventListener('keydown', activityListener); // Listen for keyboard events
  return () => {
    document.removeEventListener('click', activityListener); // Cleanup click event listener
    document.removeEventListener('keydown', activityListener); // Cleanup keyboard event listener
  };
}, []);

  // Function to handle extending session
  const extendSession = () => {
    resetInactiveTime(); // Reset inactive time
    setShowCountdown(false); // Hide the countdown
    setCountdownValue(30); // Reset countdown value
  };


  // Function to handle automatic logout when countdown finishes
  useEffect(() => {
    if (showCountdown && countdownValue === 0) {
      handleLogout(); // Auto logout if countdown reaches 0
    } else if (showCountdown && countdownValue > 0) {
      const countdownInterval = setInterval(() => {
        setCountdownValue(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [showCountdown, countdownValue]);


  // Function to decode the access token
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decode and parse the token payload
    } catch (error) {
      return null; // Return null if decoding fails
    }
  };
  // // Function to handle token expiration and logout
  // useEffect(() => {
  //   const storedToken = localStorage.getItem('accessToken');
  //   if (storedToken) {
  //     setAccessToken(storedToken);
  //     setIsLoggedIn(true);
  //   }
  //   const checkTokenExpiration = async () => {
  //     // Check token expiration and validate token here
  //   };
  //   const interval = setInterval(checkTokenExpiration, 60000); // Check token expiration every minute
  //   return () => clearInterval(interval); // Cleanup function to clear the interval on component unmount
  // }, [accessToken]);


  return (
    <Router>
      <div>
        {/* Render the navigation component */}
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        {/* Render loading spinner if isLoading is true */}
        {isLoading && <DotLoader color="#4285f4" loading={isLoading} />}
        {/* Render countdown if nearing session expiration */}
        {isLoggedIn  && showCountdown && (
          <div className="overlay" >
            <div className="countdown-container">
              <p>Your session will expire soon. Extend session?</p>
              <button className="extend-button" onClick={extendSession}>Extend</button>
              {/* Countdown display */}
              <p>Countdown: {countdownValue} seconds</p>
            </div>
          </div>
        )}
        <Routes>
          {/* Routes accessible without authentication */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/feedbackform" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/feedbackform" /> : <SignUp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          
          {/* Routes accessible only after authentication */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/feedbackform" /> : <Login onLogin={handleLogin} />} />
          <Route path="/feedbackform" element={isLoggedIn ? <FeedbackForm /> : <Navigate to="/login" />} />
          <Route path="/listOrder" element={isLoggedIn ? <OrderList accessToken={accessToken} /> : <Navigate to="/login" />} />
          <Route path="/ordertable" element={isLoggedIn ? <OrderTable /> : <Navigate to="/login" />} />
        </Routes>
        {/* Render the Footer component */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
