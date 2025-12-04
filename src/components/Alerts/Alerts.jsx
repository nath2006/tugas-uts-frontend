
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
 * - actions: ReactNode optional (tombol / custom action)
 * - hideClose: boolean optional (buat confirm, biasanya close disembunyikan)
 */

export default function Alert({
  type = "info",
  title = "Ini Alert",
  message = "Isi dulu datanya ya bro",
  duration = 5000,
  onClose,
  show,
  actions = null,
  hideClose = false,
}) {
  const [open, setOpen] = useState(show ?? true);

  // sync controlled
  useEffect(() => {
    if (show !== undefined) setOpen(show);
  }, [show]);

  useEffect(() => {
    if (!duration || !open || actions) return;
    const t = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, open, actions]);

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

        {actions && <div className="alert__actions">{actions}</div>}
      </div>

      {!hideClose && (
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
      )}
    </div>
  );
}
