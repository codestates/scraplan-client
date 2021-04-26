import React, { useEffect, useState } from "react";

interface ToastProps {
  text: string;
  dismissTime: number;
}
const Toast = ({ text, dismissTime }: ToastProps) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        setIsFading(true);
      }
    }, dismissTime - 500);

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={`notification ${isFading ? "fade-out" : ""}`}>{text}</div>
  );
};

export default Toast;
