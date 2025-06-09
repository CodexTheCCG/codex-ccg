import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MonsterPage() {
  const [monsters, setMonsters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("monsters") || "[]");
    setMonsters(stored);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Monsters</h2>

      {monsters.length === 0 ? (
        <p style={styles.text}>You haven't hatched any monsters yet!</p>
      ) : (
        <div style={styles.grid}>
          {monsters.map((m, i) => (
            <div key={i} style={styles.card}>
              <img
                src={`Sprites/Codex - The Void Sprites/${m.sprite}.png`}
                alt={m.name}
                style={styles.image}
              />
              <p style={styles.name}>{m.name || `Creature #${i + 1}`}</p>
              <p style={styles.rarity}>{m.rarity}</p>
            </div>
          ))}
        </div>
      )}

      <button style={styles.back} onClick={() => navigate("/scanner")}>
        ← Back to Scanner
      </button>
    </div>
  );
}

const styles = {
container: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "#000",
  color: "#fff",
  padding: 20,
  overflowY: "auto",
  boxSizing: "border-box",
},
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: "1.5rem",
  },
  text: {
    textAlign: "center",
    marginTop: 40,
    color: "#aaa",
  },
grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: 16,
  width: "100%",
},
  card: {
    backgroundColor: "#111",
    border: "2px solid #333",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
  },
image: {
  width: "120px",
  height: "120px",
  objectFit: "contain",
  marginBottom: 10,
},
  name: {
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  rarity: {
    fontSize: "0.85rem",
    color: "#aaa",
  },
  back: {
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
};
