import React from "react";

const SetTime = () => {
  return (
    <div className="set-time">
      <span className="set-time__text"></span>
      <div className="set-time__input-wrapper">
        <input type="number" step="0.5" min="0.5" max="6"></input>
      </div>
    </div>
  );
};

export default SetTime;
