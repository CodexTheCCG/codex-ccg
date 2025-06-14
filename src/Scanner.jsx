import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, Egg, Coin, Barcode, EggCrack, Cpu } from "phosphor-react";
import { getRewardFromBarcode } from "./rewards";
import MonsterPage from "./Monsters"; 
import { handleBarcodeScan } from './utils/handleBarcodeScan';



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
  const [creatorMode, setCreatorMode] = useState(false);
  const [generatedCreature, setGeneratedCreature] = useState(null);



  const SCAN_LIMIT = 25;

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

const startCodexCreate = async (barcode) => {
  try {
    const nameResponse = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a creature creator for a barcode-scanning monster game." },
        { role: "user", content: `I scanned an item with barcode ${barcode}. What should the monster be named?` }
      ],
      model: "gpt-4",
    });

    const creatureName = nameResponse.choices[0].message.content.trim();

    const normalSprite = await generateImage(`pixel art monster named ${creatureName}, full body, cute but mysterious`);
    const shinySprite = await generateImage(`shiny version of pixel art monster named ${creatureName}, gold and glowing, full body`);

    setGeneratedCreature({
      name: creatureName,
      normalSprite,
      shinySprite,
      codeUsed: barcode,
    });

  } catch (err) {
    console.error("Error generating Codex creature:", err);
    setMessage("❌ Failed to create monster. Try again.");
  }
};

const generateImage = async (prompt) => {
  const imageResp = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1024",
    n: 1,
    response_format: "url",
  });

  return imageResp.data[0].url;
};


  const handleBarcode = async (code) => {
    if (creatorMode) {
  // override scanning to go to Codex Create flow
  startCodexCreate(code);
  return;
}

    if (!canScan) return;
      setCanScan(false);
      setTimeout(() => setCanScan(true), 5000); // 5 seconds cooldown

    if (scannedToday >= SCAN_LIMIT + extraScans) {
      setMessage("🚫 Daily scan limit reached.");
      return;
    }

    if (!scannedBarcodes.has(code)) {
      const creatureRef = doc(db, "codex_creatures", code);
      const creatureSnap = await getDoc(creatureRef);
      if (creatureSnap.exists()) {
        const data = creatureSnap.data();
        const existing = JSON.parse(localStorage.getItem("monsters") || "[]");
        const updatedMonsters = [...existing, {
          id: Date.now(),
          name: data.name,
          sprite: data.normalSprite,
          shiny: false,
        }];
        localStorage.setItem("monsters", JSON.stringify(updatedMonsters));
        setMonsters(updatedMonsters);
        setMessage(`🧬 You unlocked ${data.name}!`);
        return;
      }
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
    const allCreatures = [
      { name: "001 Void", ascended: "001 Void (Ascended)" },
      { name: "002 Abyssling", ascended: "002 Abyssling (Ascended)" },
      { name: "003 Orren", ascended: "003 Orren (Ascended)" },
    ];

    const selected = allCreatures[Math.floor(Math.random() * allCreatures.length)];
    const isAscended = Math.floor(Math.random() * 8193) === 0;
    const assignedCreature = isAscended ? selected.ascended : selected.name;

    const newEgg = {
      id: Date.now(),
      hatchScans: 100,
      progress: 0,
      assignedCreature,
      isAscended,
    };

    const updatedEggs = [...eggs, newEgg];
    localStorage.setItem("eggs", JSON.stringify(updatedEggs));
    setEggs(updatedEggs);
    setMessage(isAscended ? `✨ You found a Shiny Egg!` : `🥚 You received an Egg!`);
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
      setMessage(`💰 Earned ${reward.amount.toLocaleString()} coins!`);
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
            setMessage("🎉 Your egg hatched!");
            localStorage.removeItem("buddyEggId");

            const isShiny = Math.floor(Math.random() * 8193) === 0;

            const existing = JSON.parse(localStorage.getItem("monsters") || "[]");
            const updatedMonsters = [...existing, {
              id: Date.now(),
              name: egg.assignedCreature + (isShiny ? " (Ascended)" : ""),
              sprite: egg.assignedCreature + (isShiny ? " (Ascended)" : ""),
              shiny: isShiny
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
<div style={styles.creatorToggleContainer}>
  <div
    style={styles.toggleWrapper}
    onClick={() => {
      const goingToCreator = location.pathname !== "/creator";
      navigate(goingToCreator ? "/creator" : "/scanner");
    }}
  >
    <div
      style={{
        ...styles.toggleSlider,
        transform: location.pathname === "/creator" ? "translateX(26px)" : "translateX(0px)",
      }}
    />
  </div>
  <span style={styles.toggleLabel}>
    {location.pathname === "/creator" ? "Creator Mode: ON" : "Creator Mode: OFF"}
  </span>
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
          <Egg size={30} />: {eggs.length}
        </div>
        <div style={styles.stat} onClick={() => navigate("/store")}>
          <Coin size={30} />: {coins}
        </div>
        <div style={styles.stat}>
          <Barcode size={30} />: {(SCAN_LIMIT + extraScans - scannedToday).toLocaleString()}
        </div>
        <div style={styles.stat} onClick={() => navigate("/monsters")}>
          <Cpu size={30} />: {monsters.length}
        </div>
      </div>

      {generatedCreature && (
  <div style={{ textAlign: "center", marginTop: 20 }}>
    <h3>🧬 Your Created Creature</h3>
    <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{generatedCreature.name}</p>
    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}>
      <div>
        <p>Normal</p>
        <img src={generatedCreature.normalSprite} alt="Normal Sprite" width="120" />
      </div>
      <div>
        <p>Shiny</p>
        <img src={generatedCreature.shinySprite} alt="Shiny Sprite" width="120" />
      </div>
    </div>
    <div style={{ marginTop: 10 }}>
      <button onClick={() => setGeneratedCreature(null)}>🔁 Reroll</button>
      <button onClick={async () => {
        await saveGeneratedCreatureToFirebase(user.uid, generatedCreature.codeUsed, generatedCreature);
        alert("✅ Saved to Codex!");
        setGeneratedCreature(null);
      }}>✅ Accept & Save</button>
    </div>
  </div>
)}

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
    bottom: 20,
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
  flexDirection: "column",      // forces the label to go below the toggle
  alignItems: "flex-end",       // aligns both toggle & label to the right
  gap: 4,
  marginLeft: "auto",
  marginRight: 10,              // push off right edge a bit
},
toggleLabel: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: "0.75rem",
  textAlign: "right",
  marginTop: 6,
},


};
