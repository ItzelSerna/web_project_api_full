const BASE_URL = "https://around-api.es.tripleten-services.com/v1";
const TOKEN = "df55ef7f-6b66-49fb-9a53-d534a83fabcc";

function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }
  return res.json();
}

const api = {
  getUserInfo() {
    return fetch(`${BASE_URL}/users/me`, {
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
    })
      .then(checkResponse);
  },

  setUserInfo({ name, about }) {
    return fetch(`${BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, about }),
    })
      .then(checkResponse);
  },

  getCards() {
    return fetch(`${BASE_URL}/cards`, {
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
    })
      .then(checkResponse);
  },

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: method,
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
    })
      .then(checkResponse);
  },

  deleteCard(cardId) {
    return fetch(`${BASE_URL}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
    })
      .then(checkResponse);
  },

  setUserAvatar({ avatar }) {
    return fetch(`${BASE_URL}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    })
      .then(checkResponse);
  },

  addCard({ name, link }) {
    return fetch(`${BASE_URL}/cards`, {
      method: "POST",
      headers: {
        authorization: TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link }),
    })
      .then(checkResponse);
  },
};

export default api;
