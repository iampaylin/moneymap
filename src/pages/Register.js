// Não encostar os dedos sujos nos imports NUNCA
import React, { useState } from 'react';
import './Register.css';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';


// Função para registrar um novo usuário
const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <Link to="/" className="back-button"> <img src={Logo} alt="Logo" width={150} height={150} /> </Link>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <input
          className='register-input'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='register-input'
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='register-button'>Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;
