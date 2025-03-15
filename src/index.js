import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./firebaseConfig"; // Ensure Firebase initializes before rendering

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
