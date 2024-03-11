// Import React and ReactDOM from 'react' and 'react-dom/client'
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the App component
import App from './App';

// Import reportWebVitals for measuring performance
import reportWebVitals from './reportWebVitals';

// Create a root using ReactDOM.createRoot and specify the root element by ID
const root = ReactDOM.createRoot(document.getElementById('root'));

// Use the root to render the App component inside React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance by passing a function to log results or send to an analytics endpoint
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
