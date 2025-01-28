import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, link });
    setName("");
    setLink("");
  };
  return (
    <PopupWithForm
      name="add-card"
      title="Nueva tarjeta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <label className="popup__label">
          <input
            type="text"
            name="name"
            placeholder="Título"
            className="popup__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="30"
          />
          <span className="popup__error" id="card-title-error"></span>
        </label>
        <label className="popup__label">
          <input
            type="url"
            name="link"
            placeholder="Enlace de la imagen"
            className="popup__input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <span className="popup__error" id="card-link-error"></span>
        </label>
        <button type="submit" className="popup__save-button">
          Crear
        </button>
      </form>
    </PopupWithForm>
  );
}
export default AddPlacePopup;
