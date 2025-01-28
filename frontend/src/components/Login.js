import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2 className="login__title">Inicia Sesión</h2>
      
      <input
        className="login__input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
      />
      
      <input
        className="login__input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      
      <button className="login__button" type="submit">Inicia Sesión</button>
      
      <Link to="/signup" className="login__link">
        <p className="login__link-message">¿Aún no eres miembro? Regístrate aquí</p>
      </Link>
    </form>
  );
}

export default Login;
