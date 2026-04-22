import React, { useEffect } from "react";

const Notification = ({ message = "", type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification--${type}`} role="status" aria-live="polite">
      <div className="notification-body">
        <div className="notification-message">{message}</div>
        <button className="notification-ok" onClick={() => onClose && onClose()}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Notification;
