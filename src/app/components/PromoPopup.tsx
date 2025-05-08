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
    
    width: "600px",
    height: "300px",
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
    top: 16,
    right: 16,
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontSize: 22,
    cursor: "pointer",
    zIndex: 10,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.92,
    transition: "opacity 0.22s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  centerContent: {
    zIndex: 2,
    width: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5vw",
    textAlign: "center" as const,
  },
  headline: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center" as const,
    margin: 0,
    marginBottom: 18,
    color: "#fff",
    lineHeight: 1.18,
    textShadow: "0 2px 12px rgba(0,0,0,0.23)",
  },
  subtext: {
    fontSize: 18,
    textAlign: "center" as const,
    color: "#fff",
    marginBottom: 10,
    textShadow: "0 1px 6px rgba(0,0,0,0.18)",
  },
  ctaBtn: {
    background: "#fff",
    color: "#181818",
    border: "none",
    borderRadius: 28,
    padding: "14px 36px",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
    transition: "background 0.18s, color 0.18s",
    outline: "none",
  },
  offerNote: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.92,
    textAlign: "center" as const,
    marginTop: 8,
    textShadow: "0 1px 6px rgba(0,0,0,0.14)",
  },
};
