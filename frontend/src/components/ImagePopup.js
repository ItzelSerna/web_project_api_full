import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_type_image ${card ? "popup_is-opened" : ""}`}>
      <div className="popup__overlay" id="popup-overlay-image"></div>
      <div className="popup__content-image">
        <button
          className="popup__close-button-image"
          id="popup__close-image"
          onClick={onClose}
        ></button>
        <img className="popup__image" src={card?.link} alt={card?.name} />
        <h2 className="popup__image-title">{card?.name}</h2>
      </div>
    </div>
  );
}

export default ImagePopup;
