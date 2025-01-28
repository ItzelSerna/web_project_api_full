import React from "react";
import logo from "../images/logo.png";
import { Link, useLocation } from 'react-router-dom';

function Header({ loggedIn, email, onLogout }) {
  const location = useLocation();

  return (
    <header className="header">
      <img src={logo} alt="Around The U.S. logo" className="header__logo" />

      {loggedIn ? (
        <div className="header__nav">
          <p className="header__user-email">{email}</p>
          <button onClick={onLogout} className="header__link">
            Cerrar sesión
          </button>
        </div>
      ) : (
        <nav className="header__nav">
          <Link
            to={location.pathname === '/signin' ? '/signup' : '/signin'}
            className="header__link"
          >
            {location.pathname === '/signin' ? 'Registrarse' : 'Iniciar sesión'}
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
