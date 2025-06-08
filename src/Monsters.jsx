// Monster.jsx
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
              <img src={m.imageUrl} alt="Monster" style={styles.image} />
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
    padding: 20,
    backgroundColor: "#000",
    minHeight: "100vh",
    color: "#fff",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 16,
  },
  card: {
    backgroundColor: "#111",
    border: "2px solid #333",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
  },
  image: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    marginBottom: 6,
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
