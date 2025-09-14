import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Navbar from './components/NavBar/NavBar';


function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage token at start (optional)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You may want to decode the token or fetch user info here
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/signup" element={!user ? <Signup onSignupSuccess={() => window.location.href = '/login'} /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <MainPage /> : <Navigate to="/login" />} />
        {/* Add catch all route to redirect to /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
