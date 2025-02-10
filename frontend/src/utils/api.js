const BASE_URL = process.env.REACT_APP_API_URL || "https://api.itzelSerna.lat";
console.log("Conectando al backend en:", BASE_URL);

function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }
  return res.json();
}

function getToken() {
  return localStorage.getItem("jwt") || "";
}

const api = {
  signup(userData) {
    return fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then(checkResponse);
  },

  signin(userData) {
    return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(checkResponse)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl; 
        }
        return data;
      });
  },

  getUserInfo() {
    return fetch(`${BASE_URL}/users/me`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }).then(checkResponse);
  },

  getCards() {
    return fetch(`${BASE_URL}/cards`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }).then(checkResponse);
  },

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: method,
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }).then(checkResponse);
  },

  deleteCard(cardId) {
    return fetch(`${BASE_URL}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }).then(checkResponse);
  },

  setUserAvatar({ avatar }) {
    return fetch(`${BASE_URL}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    }).then(checkResponse);
  },

  setUserInfo(userData) {
    return fetch(`${BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then(checkResponse);
  },

  addCard({ name, link }) {
    return fetch(`${BASE_URL}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link }),
    }).then(checkResponse);
  },
};

export default api;
