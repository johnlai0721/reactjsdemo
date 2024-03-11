import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navigation.css';
import signOutIcon from '../Assests/moveLogout.gif';

const BeforeLoginNavigation = () => {
  return (
    <nav>
      <div className="Logo">
        <img src={signOutIcon} alt="" />
      </div>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

const AfterLoginNavigation = ({ onLogout }) => {
  return (
    <nav>
      <div className="Logo">
        <img src={signOutIcon} alt="" />
      </div>
      <ul>
        <div className="navLeft">
          <li>
            <Link to="/feedbackform">FeedbackForm</Link>
          </li>
          <li>
            <Link to="/listOrder">List Orders</Link>
          </li>
        </div>
        <div className="navRight">
          <li>
            <Link to="/ordertable">OrderTable</Link>
          </li>
          <li>
            <img src={signOutIcon} alt="" onClick={onLogout} />
          </li>
        </div>
      </ul>
    </nav>
  );
};




const Navigation = ({ isLoggedIn, onLogout }) => {
  return isLoggedIn ? <AfterLoginNavigation onLogout={onLogout} /> : <BeforeLoginNavigation />;
};

export default Navigation;
