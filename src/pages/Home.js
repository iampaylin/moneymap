// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Logo from '../assets/logo.png';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Moneymap</h1>
      <img src={Logo} alt="Logo" width={150} height={150}/>
      <div className="home-buttons">
        <Link to="/login" className="home-button">Login</Link>
        <Link to="/register" className="home-button">Cadastro</Link>
      </div>
    </div>
  );
};

export default Home;