import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import EditProfile from "./components/EditProfile";
import EditAvatar from "./components/EditAvatar";
import AddPlacePopup from "./components/AddPlacePopup";
import RemoveCard from "./components/RemoveCard";
import { CurrentUserContext } from "./components/CurrentUserContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import InfoTooltip from "./components/InfoTooltip";
import api from "./utils/api";
import * as auth from "./utils/auth";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isRemoveCardPopupOpen, setIsRemoveCardPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    userId: "",
    _id: "",
    email: "",
  });

  const [cards, setCards] = useState([]);
  const [deletedCard, setDeletedCard] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("jwt") || "");

  const [loggedIn, setLoggedIn] = useState(false);
  const [infoTooltip, setInfoTooltip] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          const { email, _id } = res.data ? res.data : res;
          setCurrentUser((prev) => ({
            ...prev,
            email: email,
            _id: _id,
          }));
          setLoggedIn(true);
        })
        .catch((err) => {
          console.error("Error al verificar token:", err);
          setLoggedIn(false);
        });
    }
  }, [token]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((info) => {
          setCurrentUser((prev) => ({
            ...prev,
            name: info.name,
            about: info.about,
            avatar: info.avatar,
            userId: info._id,
            _id: info._id,
            email: prev.email,
          }));
        })
        .catch((err) =>
          console.error(`Error al cargar los datos de usuario: ${err}`)
        );

      api
        .getCards()
        .then((cardsData) => {
          const normalizedCards = cardsData.map((card) => ({
            ...card,
            likes: card.likes || [],
            owner:
              typeof card.owner === "string" ? { _id: card.owner } : card.owner,
          }));
          setCards(normalizedCards);
        })
        .catch((err) => console.error(`Error al obtener las tarjetas: ${err}`));
    }
  }, [loggedIn]);

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);

  const handleRemoveCardClick = (card) => {
    setDeletedCard(card);
    setIsRemoveCardPopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsRemoveCardPopupOpen(false);
    setSelectedCard(null);
    setDeletedCard(null);
    setInfoTooltip({ isOpen: false, message: "", type: "" });
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await api.setUserInfo(userData);
      setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
      closeAllPopups();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAvatar = async (avatarData) => {
    try {
      const updatedUser = await api.setUserAvatar(avatarData);
      setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
      closeAllPopups();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function handleCardLike(card, isLiked) {
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((updatedCard) => {
        setCards((prevCards) =>
          prevCards.map((c) => (c._id === updatedCard._id ? updatedCard : c))
        );
      })
      .catch((err) => console.error("Error al actualizar el like:", err));
  }

  const handleAddPlaceSubmit = (cardData) => {
    api
      .addCard(cardData)
      .then((newCard) => {
        const normalizedCard = {
          ...newCard,
          likes: newCard.likes || [],
          owner:
            typeof newCard.owner === "string"
              ? { _id: newCard.owner }
              : newCard.owner,
        };

        setCards([normalizedCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error("Error al agregar la tarjeta:", err));
  };

  const handleCardDelete = async () => {
    try {
      console.log("Intentando eliminar la tarjeta con ID:", deletedCard);
  
      if (!deletedCard || !deletedCard._id) {
        console.error("Error: No hay una tarjeta seleccionada para eliminar.");
        return;
      }
  
      await api.deleteCard(deletedCard._id);
  
      setCards((prevCards) =>
        prevCards.filter((c) => c._id !== deletedCard._id)
      );
  
      closeAllPopups();
    } catch (err) {
      console.error("Error al eliminar la tarjeta:", err);
    }
  };  

  function handleLogin(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        console.log("Respuesta de login:", data);
        localStorage.setItem("jwt", data.token);
        setToken(data.token); 
        setLoggedIn(true);
        
        const redirectTo = data.redirectUrl || "/";
        navigate(redirectTo);
      })
      .catch((err) => {
        console.error(err);
        setInfoTooltip({
          isOpen: true,
          message: "Error al iniciar sesión",
          type: "fail",
        });
      });
  }
  
  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        setInfoTooltip({
          isOpen: true,
          message: "¡Registro exitoso!",
          type: "success",
        });
      })
      .catch(() => {
        setInfoTooltip({
          isOpen: true,
          message: "Error en el registro",
          type: "fail",
        });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setToken("");       
    setLoggedIn(false);
    setCurrentUser((prev) => ({ ...prev, email: "" }));
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} email={currentUser.email} onLogout={handleLogout} />
      <Routes>
        <Route path="/signin" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Register onRegister={handleRegister} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute
              element={Main}
              loggedIn={loggedIn}
              email={currentUser.email}
              cards={cards}
              onEditAvatarClick={handleEditAvatarClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditProfileClick={handleEditProfileClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleRemoveCardClick}
              selectedCard={selectedCard}
              onClose={closeAllPopups}
            />
          }
        />
        <Route path="*" element={<Navigate to={loggedIn ? "/" : "/signin"} />} />
      </Routes>

      <Footer />

      <InfoTooltip
        isOpen={infoTooltip.isOpen}
        message={infoTooltip.message}
        type={infoTooltip.type}
        onClose={closeAllPopups}
      />
      <EditProfile
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleUpdateUser}
      />
      <EditAvatar
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleUpdateAvatar}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleAddPlaceSubmit}
      />
      <RemoveCard
        isOpen={isRemoveCardPopupOpen}
        onClose={closeAllPopups}
        onConfirmDelete={handleCardDelete}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
