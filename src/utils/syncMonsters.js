import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export const syncLocalMonstersToPool = async () => {
  const monsters = JSON.parse(localStorage.getItem("monsters") || "[]");
  const poolRef = collection(db, "creaturesPool");

  for (const m of monsters) {
    // Skip if missing required data
    if (!m.name || !m.normalSprite) continue;

    // Optional: prevent duplicates by name
    const q = query(poolRef, where("name", "==", m.name));
    const existing = await getDocs(q);
    if (!existing.empty) continue;

    await addDoc(poolRef, {
      name: m.name,
      normalSprite: m.normalSprite,
      shinySprite: m.shinySprite || "",
      createdBy: "local",
      source: "sync",
      createdAt: new Date()
    });
  }

  alert("✅ Synced local monsters to global egg pool!");
};
