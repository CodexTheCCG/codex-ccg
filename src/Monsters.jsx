import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "phosphor-react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MonsterPage() {
  const [allMonsters, setAllMonsters] = useState([]);
  const [unlocked, setUnlocked] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMonsters = async () => {
      const snap = await getDocs(collection(db, "codex_creatures"));
      const known = snap.docs.map(doc => doc.data());
      setAllMonsters(known);

      const stored = JSON.parse(localStorage.getItem("monsters") || "[]");
      setUnlocked(stored);
    };

    fetchMonsters();
  }, []);

  const isUnlocked = (barcode) => {
    return unlocked.some(m => m.barcode === barcode || m.codeUsed === barcode);
  };

  const getCount = (barcode) => {
    return unlocked.filter(m => m.barcode === barcode || m.codeUsed === barcode).length;
  };

  const handleDelete = (barcode) => {
    if (window.confirm("Are you sure you want to release all copies of this monster?")) {
      const updated = unlocked.filter(m => m.barcode !== barcode && m.codeUsed !== barcode);
      setUnlocked(updated);
      localStorage.setItem("monsters", JSON.stringify(updated));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Monsters</h2>

      {allMonsters.length === 0 ? (
        <p style={styles.text}>Loading Codex...</p>
      ) : (
        <div style={styles.grid}>
          {allMonsters.map((m, i) => {
            const unlockedStatus = isUnlocked(m.barcode);
            const count = getCount(m.barcode);
            return (
              <div key={m.barcode || i} style={styles.card}>
                {count > 1 && <div style={styles.countBadge}>x{count}</div>}

                {unlockedStatus && (
                  <button onClick={() => handleDelete(m.barcode)} style={styles.deleteBtn}>
                    <XCircle size={20} color="#f87171" weight="fill" />
                  </button>
                )}

                <img
                  src={unlockedStatus ? m.normalSprite : "/images/silhouette.png"}
                  alt={m.name}
                  style={styles.image}
                />
                <p style={styles.name}>{unlockedStatus ? m.name : "???"}</p>
              </div>
            );
          })}
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
    position: "relative",
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
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },
  countBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#0af",
    color: "#000",
    fontWeight: "bold",
    borderRadius: 6,
    fontSize: "0.75rem",
    padding: "2px 6px",
    zIndex: 10,
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
