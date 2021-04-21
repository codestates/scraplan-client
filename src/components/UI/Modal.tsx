import React, { useCallback, useEffect, useRef, useState } from "react";
import "./UI.scss";

type ModalProps = {
  modalType: string | null; // yesNoModal, inputModal, alertModal
  open: boolean;
  close: () => void;
  comment: string;
  handleAcceptAction?: () => void;
  handleInputAction?: any;
};

function Modal(props: ModalProps) {
  const {
    open,
    close,
    comment,
    handleAcceptAction,
    modalType,
    handleInputAction,
  } = props;
  const [inputValue, setInputValue] = useState<string>("");
  const refInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (modalType === "inputModal") {
      refInput.current?.focus();
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handleCloseBtn();
    });
  }, [open, comment]);

  const handleCloseBtn = () => {
    if (modalType === "inputModal" && handleInputAction) {
      setInputValue("");
      handleInputAction("");
    }
    close();
  };

  const handleYesBtn = () => {
    if (modalType === "inputModal") {
      if (inputValue === "") {
        refInput.current?.focus();
        return;
      }
    }
    if (handleAcceptAction) {
      handleCloseBtn();
      handleAcceptAction();
    }
  };

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target?.value);
      handleInputAction(e.target?.value);
    },
    [inputValue],
  );

  const handleKeyPressEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleYesBtn();
    }
  };

  return (
    <div className={`modal ${open ? "show" : ""}`}>
      {open ? (
        <>
          <div className="modal__outsider" onClick={handleCloseBtn}></div>
          <div className="modal__wrapper">
            <button className="modal__close-btn" onClick={handleCloseBtn}>
              &times;
            </button>
            {modalType === "alertModal" ? (
              <div className="modal__caution">!</div>
            ) : (
              <></>
            )}
            <div className="modal__title">{comment}</div>
            {modalType === "inputModal" ? (
              <input
                type="text"
                placeholder="닉네임을 입력해주세요."
                className="modal__input-text"
                value={inputValue}
                onChange={handleChangeInput}
                onKeyPress={handleKeyPressEnter}
                ref={refInput}
              />
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
