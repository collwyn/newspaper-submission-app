// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // You'll need to create this file too
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);