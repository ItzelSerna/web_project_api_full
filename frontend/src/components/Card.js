import React, { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwner = card.owner?._id === currentUser?._id;
  const isLiked = card.isLiked;
  
  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_active" : ""
  }`;
  
  function handleClick() {
    onCardClick(card);
  }
  const handleLikeClick = () => {
    onCardLike(card, isLiked);
  };
  const handleDeleteClick = () => {
    onCardDelete(card);
  };
  return (
    <div className="card">
      <img
        className="card__photo"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      {isOwner && (
        <button
          className="card__delete-button"
          onClick={handleDeleteClick}
        ></button>
      )}
      <div className="card__info">
        <p className="card__info-name">{card.name}</p>
        <div className="card__container-likes">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
        </div>
      </div>
    </div>
  );
}
export default Card;
