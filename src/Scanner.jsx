// Scanner.jsx
import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function Scanner() {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result) {
        console.log("Barcode scanned:", result.getText());
        // Handle barcode result here
      }
    });

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.cameraWrapper}>
        <video ref={videoRef} style={styles.video} autoPlay muted playsInline />
        <div style={styles.scanOverlay}></div>
      </div>
      <div style={styles.footer}>
        <p style={styles.footerText}>Scanning for encoded fragments...</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0A0A0A",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
  cameraWrapper: {
    position: "relative",
    marginTop: "30px",
    border: "3px solid #7F00FF",
    borderRadius: "12px",
    overflow: "hidden",
  },
  video: {
    width: "320px",
    height: "240px",
    objectFit: "cover",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    boxShadow: "0 0 20px #FF44AA inset, 0 0 10px #00FFD1 inset",
    pointerEvents: "none",
    zIndex: 1,
  },
  footer: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    padding: "20px 0",
    borderTop: "2px solid #AFAFAF",
    textAlign: "center",
  },
  footerText: {
    color: "#FF44AA",
    fontFamily: "monospace",
    fontSize: "1rem",
  },
};
