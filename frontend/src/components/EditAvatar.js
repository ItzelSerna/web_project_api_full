import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatar({ isOpen, onClose, onSubmit }) {
  const avatarRef = useRef("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ avatar: avatarRef.current.value });
    avatarRef.current.value = "";
  };
  return (
    <PopupWithForm
      name="edit-avatar"
      title="Editar avatar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <label className="popup__label">
          <input
            type="url"
            name="avatar"
            placeholder="URL de la imagen"
            className="popup__input"
            ref={avatarRef}
            required
          />
          <span className="popup__error" id="avatar-error"></span>
        </label>
        <button type="submit" className="popup__save-button">
          Guardar
        </button>
      </form>
    </PopupWithForm>
  );
}
export default EditAvatar;
