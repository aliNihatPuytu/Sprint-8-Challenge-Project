import React, { useEffect, useState } from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  duration = 700,       
  successHold = 500,    
  onDone,                
  loadingText = "Siparişiniz gönderiliyor...",
  successText = "Gönderildi!"
}) => {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("success"), duration);
    const t2 = setTimeout(() => {
      if (onDone) onDone();
    }, duration + successHold);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, successHold, onDone]);

  return (
    <div className="loading-overlay" role="dialog" aria-modal="true">
      <div className="loading-container" aria-live="polite">
        {phase === "loading" ? (
          <>
            <div className="spinner-circle" aria-hidden="true"></div>
            <p className="loading-text">{loadingText}</p>
          </>
        ) : (
          <>
            <svg className="success-check" viewBox="0 0 52 52" aria-hidden="true">
              <circle className="success-check-circle" cx="26" cy="26" r="24" />
              <path className="success-check-mark" fill="none" d="M14 27 L22 35 L38 19" />
            </svg>
            <p className="success-text">{successText}</p>
            <p className="success-subtext">Yönlendiriliyorsunuz…</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
