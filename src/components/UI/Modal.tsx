import React, { useEffect } from "react";
import "./UI.scss";

type ModalProps = {
  modalType: string | null; // yesNoModal, inputModal, alertModal
  open: boolean;
  close: () => void;
  comment: string;
  handleAcceptAction?: () => void;
};

function Modal(props: ModalProps) {
  const { open, close, comment, handleAcceptAction, modalType } = props;

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }, [open]);

  const handleYesBtn = () => {
    if (handleAcceptAction) {
      handleAcceptAction();
    }
  };

  return (
    <div className={`modal ${open ? "show" : ""}`}>
      {open ? (
        <>
          <div className="modal__outsider" onClick={close}></div>
          <div className="modal__wrapper">
            <button className="modal__close-btn" onClick={close}>
              &times;
            </button>
            {modalType === "alertModal" ? (
              <div className="modal__caution">!</div>
            ) : (
              <></>
            )}
            <div className="modal__title">{comment}</div>
            {modalType === "inputModal" ? (
              <input type="text" className="modal__input-text" />
            ) : (
              <></>
            )}
            {modalType === "yesNoModal" || modalType === "inputModal" ? (
              <div className="modal__btns">
                <button className="modal__btns-yes" onClick={handleYesBtn}>
                  네
                </button>
                <button className="modal__btns-no" onClick={close}>
                  아니오
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Modal;
