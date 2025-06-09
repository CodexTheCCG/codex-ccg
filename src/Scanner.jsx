import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, Egg, Coin, Barcode, EggCrack, Cpu } from "phosphor-react";
import { getRewardFromBarcode } from "./rewards";
import MonsterPage from "./Monsters"; 


export default function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const codeReader = useRef(null);
  const navigate = useNavigate();
  const [scannedToday, setScannedToday] = useState(0);
  const [scannedBarcodes, setScannedBarcodes] = useState(new Set());
  const [message, setMessage] = useState("");
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("coins") || "0", 10));
  const [eggs, setEggs] = useState(() => JSON.parse(localStorage.getItem("eggs") || "[]"));
  const [extraScans, setExtraScans] = useState(() => parseInt(localStorage.getItem("extraScans") || "0", 10));
  const [buddyEgg, setBuddyEgg] = useState(null);
  const [canScan, setCanScan] = useState(true);
  const [monsters, setMonsters] = useState(() => {
    const stored = localStorage.getItem("monsters");
    return stored ? JSON.parse(stored) : [];
  });

  const SCAN_LIMIT = 1000;

  useEffect(() => {
    const buddyId = localStorage.getItem("buddyEggId");
    const storedEggs = JSON.parse(localStorage.getItem("eggs") || "[]");
    if (buddyId) {
      const buddy = storedEggs.find(e => e.id.toString() === buddyId.toString());
      setBuddyEgg(buddy || null);
    } else {
      setBuddyEgg(null);
    }
  }, [eggs, scannedToday]);

  useEffect(() => {
    const storedDate = localStorage.getItem("scanDate");
    const storedCount = parseInt(localStorage.getItem("scanCount") || "0", 10);
    const now = new Date();
    const estNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const todayStr = estNow.toDateString();

    if (storedDate === todayStr) {
      setScannedToday(storedCount);
    } else {
      localStorage.setItem("scanDate", todayStr);
      localStorage.setItem("scanCount", "0");
    }

    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result) handleBarcode(result.getText());
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
  }, [scannedBarcodes]);

  const handleBarcode = (code) => {
    if (!canScan) return;
      setCanScan(false);
      setTimeout(() => setCanScan(true), 3000); // 3 seconds cooldown

    if (scannedToday >= SCAN_LIMIT + extraScans) {
      setMessage("🚫 Daily scan limit reached.");
      return;
    }

    if (!scannedBarcodes.has(code)) {
      setScannedBarcodes((prev) => new Set(prev).add(code));
      setScannedToday((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("scanCount", newCount.toString());
        return newCount;
      });

      const reward = getRewardFromBarcode(code);

      if (reward) {
        switch (reward.type) {
          case "egg":
            (async () => {
              const rarityCreatureMap = {
                common: ["001 Void"],
                uncommon: ["001 VOID"],
                rare: ["001 Void (Ascended)"],
              };

              const availableCreatures = rarityCreatureMap[reward.rarity] || ["001 Void"];
              const assignedCreature = availableCreatures[Math.floor(Math.random() * availableCreatures.length)];

              const newEgg = {
                id: Date.now(),
                rarity: reward.rarity,
                hatchScans: reward.hatchScans || 100,
                progress: 0,
                assignedCreature,
              };

              const updatedEggs = [...eggs, newEgg];
              localStorage.setItem("eggs", JSON.stringify(updatedEggs));
              setEggs(updatedEggs);
              setMessage(`🥚 Found a ${reward.rarity} egg!`);
            })();
            break;

          case "extraScans":
            setExtraScans(prev => {
              const updated = prev + reward.amount;
              localStorage.setItem("extraScans", updated.toString());
              return updated;
            });
            setMessage(`➕ Earned ${reward.amount} extra scan(s)!`);
            break;

          case "currency":
            setCoins(prev => {
              const updated = prev + reward.amount;
              localStorage.setItem("coins", updated.toString());
              return updated;
            });
            setMessage(`💰 Earned ${reward.amount} coins!`);
            break;

          default:
            setMessage("✅ Scan Successful!");
        }

        const buddyId = localStorage.getItem("buddyEggId");
        let eggsList = JSON.parse(localStorage.getItem("eggs") || "[]");

        if (buddyId) {
          eggsList = eggsList.map(egg => {
            if (egg.id.toString() === buddyId.toString()) {
              const updatedProgress = (egg.progress || 0) + 1;
                if (updatedProgress >= egg.hatchScans) {
                  setMessage(`🎉 Your ${egg.rarity} egg hatched!`);
                  localStorage.removeItem("buddyEggId");

                  // ✅ Add the hatched creature to the monster list
                  const existing = JSON.parse(localStorage.getItem("monsters") || "[]");
                  const updatedMonsters = [...existing, {
                    id: Date.now(),
                    name: egg.assignedCreature,
                    sprite: egg.assignedCreature,
                    rarity: egg.rarity,
                  }];
                  localStorage.setItem("monsters", JSON.stringify(updatedMonsters));

                  return null;
                }
              return { ...egg, progress: updatedProgress };
            }
            return egg;
          }).filter(Boolean);
          localStorage.setItem("eggs", JSON.stringify(eggsList));
          setEggs(eggsList);
        }
      } else {
        setMessage("✅ Scan Successful!");
      }

      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.cameraWrapper}>
        <video ref={videoRef} style={styles.video} playsInline muted />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div style={styles.counterRow}>
          <div style={styles.counterBox}>
            <span style={styles.counterLabel}>Scans Today:</span>
            <span style={styles.counterValue}>{scannedToday}</span>
          </div>
        </div>
      </div>

      <div style={styles.contentArea}>
        <h2 style={styles.title}>Codex Scanner</h2>
        {message && (
          <div style={styles.rewardBox}>
            <p style={styles.rewardText}>{message}</p>
          </div>
        )}
      </div>

      {buddyEgg && (
        <div style={styles.eggDisplay}>
          {buddyEgg.hatchScans - (buddyEgg.progress || 0) <= 10 ? (
            <EggCrack size={64} color="#fff" />
          ) : (
            <Egg size={64} color="#fff" />
          )}
          <p style={styles.buddyLabel}>
            Scans to Hatch: {buddyEgg.progress || 0} / {buddyEgg.hatchScans}
          </p>
        </div>
      )}

      <div style={styles.statsRow}>
        <div style={styles.stat} onClick={() => navigate("/egg")}>
          <Egg size={25} />: {eggs.length}
        </div>
        <div style={styles.stat}>
          <Coin size={25} />: {coins}
        </div>
        <div style={styles.stat}>
          <Barcode size={25} />: {(SCAN_LIMIT + extraScans - scannedToday).toLocaleString()}
        </div>
        <div style={styles.stat} onClick={() => navigate("/monsters")}>
          <Cpu size={25} />: {monsters.length}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#111", minHeight: "100vh" },
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
    justifyContent: "space-between",
    width: "90%",
    marginTop: "10px",
    alignItems: "center",
  },
  counterBox: {
    color: "#fff",
    fontSize: "1rem",
  },
  counterLabel: {
    fontWeight: "bold",
  },
  counterValue: {
    marginLeft: "6px",
    color: "#0f0",
  },
  title: {
    color: "#fff",
    marginTop: "260px",
    textAlign: "center",
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
  contentArea: {
    paddingTop: "20px",
    textAlign: "center",
  },
  eggDisplay: {
    position: "fixed",
    bottom: "60px",
    left: 0,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#111",
    padding: "10px 0",
    borderTop: "1px solid #333",
    zIndex: 1000,
  },
  buddyLabel: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#fff",
  },
  statsRow: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    borderTop: "2px solid #333",
    padding: "10px 0",
    display: "flex",
    justifyContent: "space-around",
    color: "#fff",
    fontSize: "0.95rem",
    zIndex: 1000,
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0 10px",
  },
};
