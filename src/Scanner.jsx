import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function Scanner() {
  const videoRef = useRef(null);
  const [scannedCode, setScannedCode] = useState(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          const code = result.getText();
          if (code !== scannedCode) {
            setScannedCode(code);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to start barcode scanner", err);
      });

    return () => {
      if (codeReader.current) {
        codeReader.current.reset?.();
        codeReader.current.stopContinuousDecode?.();
      }
    };
  }, [scannedCode]);

  return (
    <div style={styles.container}>
      {/* Floating Camera */}
      <div style={styles.cameraWrapper}>
        <video ref={videoRef} style={styles.video} playsInline muted />
      </div>

      {/* Scrollable Area Below */}
      <div style={styles.scrollArea}>
        <h2 style={styles.title}>Barcode Scanner</h2>
        {scannedCode && (
          <div style={styles.infoBox}>
            <h3>Scan Successful!</h3>
          </div>
        )}
        <div style={styles.placeholder}>
          <p>This is a scrollable area below the camera.</p>
          <p>Scroll down for more content.</p>
          <div style={{ height: "1200px" }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  cameraWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#000",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "220px",
    borderBottom: "2px solid #333",
  },
  video: {
    width: "90%",
    maxWidth: "480px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "4px solid #ccc",
  },
  scrollArea: {
    marginTop: "240px", // Leave space for fixed camera
    padding: "20px",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    marginBottom: "20px",
  },
  infoBox: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: "10px",
    padding: "15px",
    margin: "20px auto",
    maxWidth: "300px",
  },
  placeholder: {
    color: "#aaa",
    fontSize: "0.95rem",
  },
};
