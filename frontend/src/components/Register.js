import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await onRegister(email, password);
      navigate('/signin');
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  }

  return (
    <form className="register" onSubmit={handleSubmit}>
      <h2 className="register__title">Regístrate</h2>

      <input
        type="email"
        className="register__input"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        className="register__input"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" className="register__button">Regístrate</button>

      <Link to="/signin" className="register__link">
        <p className="register__link-message">¿Ya eres miembro? Inicia sesión aquí</p>
      </Link>
    </form>
  );
}

export default Register;
