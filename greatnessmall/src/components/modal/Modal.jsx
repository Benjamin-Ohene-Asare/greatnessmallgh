import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="modal-container">

        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close"
        >
          <X
            size={21}
            aria-hidden="true"
          />
        </button>

        {children}

      </div>

    </div>
  );
};

export default Modal;