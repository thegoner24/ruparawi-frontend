"use client";
import React, { useEffect, useState } from "react";

const PROMO_IMAGE = "https://cdn.shopify.com/s/files/1/0713/6873/files/IMG_5876.jpg?v=1746588702"; // Replace with your image if needed

export default function PromoPopup() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Optionally, add logic to only show once per session
    setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={{...styles.modal, backgroundImage: `url(${PROMO_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={styles.bgOverlay} />
        <button style={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
        <div style={styles.centerContent}>
          <h1 style={styles.headline}>Wait! Bonus<br/>Special Offer!</h1>
          <p style={styles.subtext}>Click Below To Complete Your Purchase</p>
          <button style={styles.ctaBtn} onClick={() => setOpen(false)}>
            Claim Now
          </button>
          <p style={styles.offerNote}>*Special Offer Until September 2024</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bgOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(20, 20, 20, 0.60)",
    zIndex: 1,
  },
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.35)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    borderRadius: 18,
    maxWidth: 900,
    width: "96vw",
    height: "80vh",
    minHeight: 500,
    boxShadow: "0 6px 32px rgba(0,0,0,0.18)",
    position: "relative" as const,
    overflow: "hidden",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute" as const,
    top: 20,
    right: 28,
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 28,
    cursor: "pointer",
    zIndex: 10,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
    transition: "opacity 0.2s",
  },
  centerContent: {
    position: "relative" as const,
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10vw",
    textAlign: "center" as const,
  },
  headline: {
    fontSize: 64,
    fontWeight: 800,
    textAlign: "center" as const,
    margin: 0,
    marginBottom: 32,
    color: "#fff",
    lineHeight: 1.12,
    textShadow: "0 2px 16px rgba(0,0,0,0.25)",
  },
  subtext: {
    fontSize: 28,
    textAlign: "center" as const,
    color: "#fff",
    marginBottom: 54,
    textShadow: "0 1px 8px rgba(0,0,0,0.22)",
  },
  ctaBtn: {
    background: "#fff",
    color: "#181818",
    border: "none",
    borderRadius: 32,
    padding: "18px 56px",
    fontSize: 36,
    fontWeight: 900,
    cursor: "pointer",
    marginBottom: 52,
    boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
    transition: "background 0.2s, color 0.2s",
    outline: "none",
  },
  offerNote: {
    fontSize: 22,
    color: "#fff",
    opacity: 0.93,
    textAlign: "center" as const,
    marginTop: 24,
    textShadow: "0 1px 8px rgba(0,0,0,0.18)",
  },
};
