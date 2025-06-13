import React from "react";
import { syncLocalMonstersToPool } from "../utils/syncMonsters";

export default function SyncButton() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <button
        onClick={syncLocalMonstersToPool}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          backgroundColor: "#0f0",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        🌐 Sync Local Monsters to Global Pool
      </button>
    </div>
  );
}
