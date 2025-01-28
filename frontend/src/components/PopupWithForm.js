import React from 'react';

function PopupWithForm({ name, title, isOpen, onClose, children }) {
  return (
    <section
      className={`popup popup_type_${name} ${isOpen ? "popup_is-opened" : ""}`}
    >
      <div className="popup__overlay" onClick={onClose}></div>
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        ></button>
        {title && <h2 className="popup__title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}
export default PopupWithForm;