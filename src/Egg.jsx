import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EggPage() {
  const [eggs, setEggs] = useState([]);
  const [selectedEggIndex, setSelectedEggIndex] = useState(null);
  const [buddyEggId, setBuddyEggId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("eggs");
    const buddyId = localStorage.getItem("buddyEggId");

    if (stored) {
      const parsed = JSON.parse(stored);

      const eggsWithIds = parsed.map((egg, i) => ({
        ...egg,
        id: egg.id || `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`
      }));

      const rarityOrder = { rare: 0, uncommon: 1, common: 2 };
      eggsWithIds.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

      setEggs(eggsWithIds);
      localStorage.setItem("eggs", JSON.stringify(eggsWithIds));
    }

    if (buddyId) {
      setBuddyEggId(buddyId);
    }
  }, []);

  const handleEggClick = (index) => {
    setSelectedEggIndex(index);
  };

  const handleDeleteEgg = (id) => {
    const filtered = eggs.filter((egg) => egg.id !== id);
    setEggs(filtered);
    localStorage.setItem("eggs", JSON.stringify(filtered));

    if (buddyEggId && id.toString() === buddyEggId.toString()) {
      localStorage.removeItem("buddyEggId");
      setBuddyEggId(null);
    }
  };

  const confirmSetBuddy = () => {
    const selected = eggs[selectedEggIndex];
    if (!selected) return;

    localStorage.setItem("buddyEggId", selected.id.toString());
    setBuddyEggId(selected.id);
    setSelectedEggIndex(null);

    setTimeout(() => {
      navigate("/scanner");
    }, 300);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Eggs</h2>

      {eggs.length === 0 ? (
        <p style={styles.text}>You don't have any eggs yet!</p>
      ) : (
        <div style={styles.eggGrid}>
          {eggs.map((egg, index) => {
            const isBuddy = egg.id.toString() === buddyEggId;

            return (
              <div
                key={egg.id}
                style={{
                  ...styles.eggCard,
                  borderColor: getRarityColor(egg.rarity),
                }}
                onClick={() => handleEggClick(index)}
              >
                {isBuddy && <div style={styles.buddyBadge}>BUDDY</div>}
                <button
                  style={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEgg(egg.id);
                  }}
                >
                  ❌
                </button>
                <p
                  style={{
                    ...styles.eggLabel,
                    color: isBuddy ? "#0f0" : "#fff",
                  }}
                >
                  {egg.rarity.toUpperCase()}
                </p>
                <p style={styles.eggDetail}>
                  Scans: {egg.progress || 0} / {egg.hatchScans}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selectedEggIndex !== null && (
        <div style={styles.popup}>
          <p style={styles.popupText}>Make this egg your buddy?</p>
          <div style={styles.popupButtons}>
            <button style={styles.yesButton} onClick={confirmSetBuddy}>Yes</button>
            <button style={styles.noButton} onClick={() => setSelectedEggIndex(null)}>No</button>
          </div>
        </div>
      )}

      <button style={styles.backButton} onClick={() => navigate("/scanner")}>
        ← Back to Scanner
      </button>
    </div>
  );
}

function getRarityColor(rarity) {
  if (rarity === "rare") return "#ff69b4";
  if (rarity === "uncommon") return "#87cefa";
  return "#ccc";
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#000",
    minHeight: "100vh",
    color: "#fff",
    width: "100vw",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: "1.5rem",
  },
  eggGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 16,
    padding: "0 10px",
  },
  eggCard: {
    position: "relative",
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 10,
    border: "2px solid #555",
    textAlign: "center",
    width: "100px",
    cursor: "pointer",
  },
  eggLabel: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: 4,
  },
  eggDetail: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
  buddyBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#0f0",
    color: "#000",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: "0.65rem",
    fontWeight: "bold",
    zIndex: 10,
  },
  deleteButton: {
    position: "absolute",
    top: "4px",
    right: "4px",
    background: "transparent",
    border: "none",
    color: "#f55",
    fontSize: "1.2rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
  },
  popup: {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    zIndex: 2000,
    textAlign: "center",
  },
  popupText: {
    marginBottom: 15,
  },
  popupButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  yesButton: {
    padding: "6px 14px",
    backgroundColor: "#0f0",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    color: "#000",
  },
  noButton: {
    padding: "6px 14px",
    backgroundColor: "#f00",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    color: "#fff",
  },
  backButton: {
    marginTop: 30,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "8px 16px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  text: {
    textAlign: "center",
    marginTop: 40,
    color: "#aaa",
  },
};
