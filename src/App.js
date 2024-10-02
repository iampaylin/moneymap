// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/goals" element={<Goals user={user} />} />
        </Routes>

        {user && (
          <footer className="bottom-nav">
            <Link to="/dashboard" className="nav-item">
              <div className="circle-icon">💰</div>
              <span>Controle</span>
            </Link>
            <Link to="/goals" className="nav-item">
              <div className="circle-icon">🎯</div>
              <span>Metas</span>
            </Link>
          </footer>
        )}
      </Router>
  );
}

export default App;
