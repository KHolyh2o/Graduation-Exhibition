import React from 'react';

const Modal = ({ isOpen, onClose, boxClassName = '', ariaLabelledby, children }) => (
  <div
    className={`modal-overlay${isOpen ? ' active' : ''}`}
    role="dialog"
    aria-modal="true"
    aria-labelledby={ariaLabelledby}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    {isOpen && (
      <div className={`modal-box ${boxClassName}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="모달 닫기" onClick={onClose}>✕</button>
        {children}
      </div>
    )}
  </div>
);

export default Modal;
