import React, { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import Card from "./Card";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";

function Main({
  cards,
  onEditProfileClick,
  onAddPlaceClick,
  onEditAvatarClick,
  onCardClick,
  onCardLike,
  onCardDelete,
  selectedCard,
  onClose,
}) {

  const currentUser = useContext(CurrentUserContext);
  
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <img
            src={currentUser.avatar}
            alt="Avatar del usuario"
            className="profile__avatar"
          />
          <button
            className="profile__edit-icon"
            onClick={onEditAvatarClick} 
          ></button>
        </div>
        <div className="profile__info">
          <div className="profile__container">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            onClick={onEditProfileClick} 
          ></button>
          </div>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          onClick={onAddPlaceClick} 
        ></button>
      </section>
      <section className="cards">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
            onClose={onClose}
            ImagePopup={selectedCard}
          />
        ))}
      </section>
      {selectedCard && (
        <ImagePopup card={selectedCard} onClose={onClose} />
      )}
      <PopupWithForm name={"popup"} />
    </main>
  );
}
export default Main;