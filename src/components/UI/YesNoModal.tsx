import React, { useEffect } from "react";
import "./UI.scss";

type YesNoModalProps = {
  open: boolean;
  close: () => void;
  comment: string;
  handleAcceptAction?: () => void;
};

function YesNoModal(props: YesNoModalProps) {
  const { open, close, comment, handleAcceptAction } = props;

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
    <div className={`yesnomodal ${open ? "show" : ""}`}>
      {open ? (
        <>
          <div className="yesnomodal__outsider" onClick={close}></div>
          <div className="yesnomodal__wrapper">
            <button className="yesnomodal__close-btn" onClick={close}>
              &times;
            </button>
            <div className="yesnomodal__title">{comment}</div>
            <div className="yesnomodal__btns">
              <button className="yesnomodal__btns-yes" onClick={handleYesBtn}>
                네
              </button>
              <button className="yesnomodal__btns-no" onClick={close}>
                아니오
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default YesNoModal;
