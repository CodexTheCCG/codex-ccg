import React from "react";
import SyncButton from "../components/SyncButton";
import { useNavigate } from "react-router-dom";

export default function DevTools() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: 30 }}>
      <h1>🛠 Dev Tools</h1>
      <p>Use these tools during development to test syncing and features.</p>
      <SyncButton />
      <button
        onClick={() => navigate("/scanner")}
        style={{ marginTop: 20, background: "#fff", color: "#000", padding: 10, borderRadius: 6 }}
      >
        ← Back to Scanner
      </button>
    </div>
  );
}
