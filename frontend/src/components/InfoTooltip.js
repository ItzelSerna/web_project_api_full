import React from 'react';
import successIcon from '../images/tooltipSuccess.png';
import failIcon from '../images/tooltipFail.png';

function InfoTooltip({ isOpen, onClose, type }) {
    const message =
        type === 'success'
            ? '¡Correcto! Ya estás registrado.'
            : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.';

    return (
        <div className={`tooltip ${isOpen ? 'tooltip__open' : ''}`}>
            <div className={`tooltip__content tooltip__content_${type}`}>
                <img
                    src={type === 'success' ? successIcon : failIcon}
                    alt={type === 'success' ? 'Éxito' : 'Error'}
                    className="tooltip__icon"
                />
                <p className="tooltip__message">{message}</p>
                <button
                    className="tooltip__close-button"
                    type="button"
                    onClick={onClose}
                ></button>
            </div>
        </div>
    );
}

export default InfoTooltip;
