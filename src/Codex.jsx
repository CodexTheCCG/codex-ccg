import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Codex() {
  const [creatures, setCreatures] = useState([]);
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    const fetchCreatures = async () => {
      const snap = await getDocs(collection(db, "codex_creatures"));
      setCreatures(snap.docs.map(doc => doc.data()));
    };

    const localUnlocked = JSON.parse(localStorage.getItem("monsters") || "[]");
    const unlockedCodes = localUnlocked.map(m => m.barcode || m.codeUsed);
    setUnlocked(unlockedCodes);

    fetchCreatures();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: 'white' }}>📖 Your Codex</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {creatures.map(monster => {
          const isUnlocked = unlocked.includes(monster.barcode);
          return (
            <div key={monster.barcode} style={{ width: 100, textAlign: 'center' }}>
              <img
                src={isUnlocked ? monster.normalSprite : '/images/silhouette.png'}
                alt={monster.name}
                width={80}
                style={{ borderRadius: 8 }}
              />
              <p style={{ color: 'white', fontSize: '0.9rem' }}>
                {isUnlocked ? monster.name : '???'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}