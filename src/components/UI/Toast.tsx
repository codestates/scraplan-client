import React from "react";

const Toast = (message: string) => {
  return (
    <div className="toast">
      <p>{message}</p>
    </div>
  );
};
export default Toast;
