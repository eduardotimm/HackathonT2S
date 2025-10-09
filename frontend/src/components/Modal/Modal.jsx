import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <Button onClick={onClose} label="OK" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
