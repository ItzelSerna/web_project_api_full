const BASE_URL = process.env.REACT_APP_API_URL || "https://api.itzelSerna.lat";

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  }).then((res) => {
      if (!res.ok) {
          return Promise.reject(`Error en /signup: ${res.status}`);
      }
      return res.json();
  });
};

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(`Error en /signin: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Data recibida en authorize:", data);
      return data;
    });
  };
  

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res) => {
        if (!res.ok) {
            return Promise.reject(`Error al verificar token: ${res.status}`);
        }
        return res.json();
    });
};