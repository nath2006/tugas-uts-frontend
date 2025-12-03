import React, { useEffect, useState } from "react";
import "./style.css";

/**
 * Props:
 * - type: "info" | "success" | "warning" | "error"
 * - title: string
 * - message: string
 * - duration: number (ms) optional, auto hilang
 * - onClose: () => void optional
 * - show: boolean optional (controlled)
 */

export default function Alert({
  type = "info",
  title = "Ini Alert",
  message = "Isi dulu datanya ya bro",
  duration = 0,
  onClose,
  show,
}) {
  const [open, setOpen] = useState(show ?? true);

  // sync controlled
  useEffect(() => {
    if (show !== undefined) setOpen(show);
  }, [show]);

  // auto dismiss
  useEffect(() => {
    if (!duration || !open) return;
    const t = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, open]);

  function handleClose() {
    if (show === undefined) setOpen(false);
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className={`alert alert--${type}`} role="alert" aria-live="polite">
      <div className="alert__icon" aria-hidden="true">
        <span className="alert__icon-dot">i</span>
      </div>

      <div className="alert__content">
        <div className="alert__title">{title}</div>
        <div className="alert__message">{message}</div>
      </div>

      <button
        className="alert__close"
        onClick={handleClose}
        aria-label="Close alert"
        title="Close"
      >
        <svg viewBox="0 0 24 24" className="alert__close-icon">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
