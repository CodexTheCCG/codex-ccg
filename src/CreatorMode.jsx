import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function CreatorMode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const codeReader = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [generatedCreature, setGeneratedCreature] = useState(null);
  const [lastCode, setLastCode] = useState(null);


  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result) {
          startCodexCreate(result.getText());
        }
      },
      {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }
    );

    return () => {
      codeReader.current?.reset?.();
      codeReader.current?.stopContinuousDecode?.();
    };
  }, []);

 const startCodexCreate = async (code) => {
  try {
    setMessage("🧬 Generating... " + code);

    const response = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scannedItem: code }), // ✅ Now using the parameter
    });

    const data = await response.json();

    if (!data.creatureName || !data.normalSprite || !data.shinySprite) {
      throw new Error("No creature returned");
    }

    setGeneratedCreature({
      name: data.creatureName,
      normalSprite: `data:image/png;base64,${data.normalSprite}`,
      shinySprite: `data:image/png;base64,${data.shinySprite}`,
      codeUsed: code,
    });

    setLastCode(code); // store the last scanned code


    setMessage(`✅ Created: ${data.creatureName}`);
  } catch (err) {
    console.error("OpenAI generation failed", err);
    setMessage("❌ Failed to create creature.");
  }
};



  return (
    <div style={styles.container}>
      <div style={styles.cameraWrapper}>
        <video ref={videoRef} style={styles.video} playsInline muted />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div style={styles.counterRow}>
          <div style={styles.creatorToggleContainer}>
            <div
              style={styles.toggleWrapper}
              onClick={() => navigate("/scanner")}
            >
              <div
                style={{
                  ...styles.toggleSlider,
                  transform: "translateX(26px)"
                }}
              />
            </div>
            <span style={styles.toggleLabel}>Creator Mode: ON</span>
          </div>
        </div>
      </div>

      <div style={styles.contentArea}>
        <h2 style={styles.title}>Codex Creator</h2>
        {message && (
          <div style={styles.rewardBox}>
            <p style={styles.rewardText}>{message}</p>
          </div>
        )}
      </div>

            {generatedCreature && (
            <div style={{
                marginTop: 30,
                padding: "0 20px",
                width: "100%",
                boxSizing: "border-box",
                textAlign: "center"
            }}>
          <h3>🧬 Your Created Creature</h3>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{generatedCreature.name}</p>
         <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: 20 }}>
            <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "bold" }}>Normal</p>
                <img
                src={generatedCreature.normalSprite}
                alt="Generated"
                style={{
                    imageRendering: "pixelated",
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    borderRadius: 8
                }}
                />
            </div>
            </div>
          <div style={{ marginTop: 10 }}>
                <div style={{ marginTop: 10 }}>
                <button onClick={() => {
                    if (lastCode) startCodexCreate(lastCode);
                    }}>🔁 Reroll</button>
                <button
                    onClick={() => {
                    const existing = JSON.parse(localStorage.getItem("monsters") || "[]");
                    const updated = [
                        ...existing,
                        {
                        id: Date.now(),
                        name: generatedCreature.name,
                        sprite: generatedCreature.normalSprite,
                        shinySprite: generatedCreature.shinySprite,
                        shiny: false, // or true if you want to randomly assign it
                        fromCode: generatedCreature.codeUsed,
                        }
                    ];
                    localStorage.setItem("monsters", JSON.stringify(updated));
                    alert("✅ Creature saved to your collection!");
                    setGeneratedCreature(null);
                    }}
                >
                    ✅ Accept & Save
                </button>
                </div>
       </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
  backgroundColor: "#111",
  minHeight: "100vh",
  width: "100vw",              // ✅ force full viewport width
  boxSizing: "border-box",     // ✅ prevent padding from overflowing
  overflowX: "hidden",         // ✅ prevent any horizontal scroll
},
  cameraWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "240px",
    backgroundColor: "#000",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "10px",
    borderBottom: "2px solid #333",
  },
  video: {
    width: "90%",
    maxWidth: "480px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "4px solid #ccc",
  },
  counterRow: {
    display: "flex",
    justifyContent: "flex-end",
    width: "90%",
    marginTop: "10px",
    alignItems: "center",
  },
contentArea: {
  paddingTop: "260px",
  textAlign: "center",
  paddingLeft: 20,
  paddingRight: 20,
  maxWidth: "100%",
  boxSizing: "border-box",
},
  title: {
    color: "#fff",
    fontSize: "1.5rem",
    marginBottom: 10,
  },
  rewardBox: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#222",
    color: "#0f0",
    borderRadius: "12px",
    display: "inline-block",
    fontWeight: "bold",
    textAlign: "center",
  },
  rewardText: {
    fontSize: "1.1rem",
  },
  toggleWrapper: {
    width: 50,
    height: 26,
    backgroundColor: "#333",
    borderRadius: 13,
    padding: 2,
    cursor: "pointer",
    position: "relative",
    transition: "background-color 0.3s ease",
  },
  toggleSlider: {
    width: 22,
    height: 22,
    backgroundColor: "#0ff",
    borderRadius: "50%",
    position: "absolute",
    top: 2,
    left: 2,
    transition: "transform 0.25s ease",
  },
  creatorToggleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
    marginLeft: "auto",
    marginRight: 10,
  },
  toggleLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "0.75rem",
    textAlign: "right",
    marginTop: 6,
  },
};
