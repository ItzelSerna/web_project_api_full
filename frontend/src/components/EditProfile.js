import React, { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfile({ isOpen, onClose, onSubmit }) {
  const { currentUser } = useContext(CurrentUserContext) || {};
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setAbout(currentUser.about || "");
    }
  }, [currentUser, isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, about });
  };
  return (
    <PopupWithForm
      name="edit-profile"
      title="Editar perfil"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <label className="popup__label">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="popup__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="40"
          />
          <span className="popup__error" id="name-error"></span>
        </label>
        <label className="popup__label">
          <input
            type="text"
            name="about"
            placeholder="Acerca de mí"
            className="popup__input"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            minLength="2"
            maxLength="200"
          />
          <span className="popup__error" id="about-error"></span>
        </label>
        <button type="submit" className="popup__save-button">
          Guardar
        </button>
      </form>
    </PopupWithForm>
  );
}
export default EditProfile;