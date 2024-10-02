import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import Logo from '../assets/logo.png';

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ email });
    navigate('/dashboard');
  };

  return (
    <div className="register-container">
      <Link to="/" className="back-button"><img src={Logo} alt="Logo" width={90} height={90}/></Link>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;
