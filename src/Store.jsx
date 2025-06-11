import React, { useEffect, useState } from "react";
import {
  Egg, Star, Sparkle, PlusCircle, ShoppingCart, Coin,
  Pill, WifiHigh, CaretDown, CaretUp, Barcode, ArrowLeft
} from "phosphor-react";
import { useNavigate } from "react-router-dom";

const storeItems = [
  {
    id: "egg_common",
    name: "Common Egg",
    price: 1000,
    type: "egg",
    rarity: "common",
    icon: <Egg size={32} color="#cccccc" /> // gray
  },
  {
    id: "egg_uncommon",
    name: "Uncommon Egg",
    price: 3000,
    type: "egg",
    rarity: "uncommon",
    icon: <Egg size={32} color="#87cefa" /> // blue
  },
  {
    id: "egg_rare",
    name: "Rare Egg",
    price: 10000,
    type: "egg",
    rarity: "rare",
    icon: <Egg size={32} color="#ff69b4" /> // pink
  },
  {
    id: "egg_hyperrare",
    name: "Hyper Rare Egg",
    price: 100000,
    type: "egg",
    rarity: "hyper_rare",
    icon: <Egg size={32} color="#ffd700" /> // gold/yellow
  },
  { id: "extra_scans", name: "Extra Scans (+5)", price: 250, type: "scan", amount: 5, icon: <Barcode size={32} /> },
  { id: "extra_scans", name: "Extra Scans (+10)", price: 450, type: "scan", amount: 10, icon: <Barcode size={32} /> },
];

export default function Store() {
  const [coins, setCoins] = useState(0);
  const [message, setMessage] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("coins") || "0", 10);
    setCoins(stored);
  }, []);

  const handlePurchase = (item) => {
    if (coins < item.price) {
      setMessage("Not enough coins!");
      return;
    }

    const newCoins = coins - item.price;
    setCoins(newCoins);
    localStorage.setItem("coins", newCoins.toString());

    if (item.type === "egg") {
      const existingEggs = JSON.parse(localStorage.getItem("eggs") || "[]");
      const newEgg = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        rarity: item.rarity,
        hatchScans: item.rarity === "hyper_rare" ? 500 : item.rarity === "rare" ? 250 : 100,
        progress: 0,
        spriteId: null,
        creatureName: null,
        basePrompt: `cute ${item.rarity} creature`,
      };
      localStorage.setItem("eggs", JSON.stringify([...existingEggs, newEgg]));
    } else if (item.type === "scan") {
      const current = parseInt(localStorage.getItem("extraScans") || "0", 10);
      const updated = current + item.amount;
      localStorage.setItem("extraScans", updated.toString());
    }

    setMessage(`✅ Purchased: ${item.name}`);
  };

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const renderItems = (type) => {
    return storeItems
      .filter((item) => item.type === type)
      .map((item) => (
        <div
          key={item.id}
          style={{
            background: "#1f1f1f",
            border: "1px solid #333",
            borderRadius: 16,
            padding: 20,
            marginBottom: 14,
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {item.icon}
            <div>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</div>
              <div style={{ marginTop: 4, fontSize: 16 }}>💰 {item.price.toLocaleString()} coins
</div>
            </div>
          </div>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              border: "none",
              background: "#fff",
              color: "#000",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => handlePurchase(item)}
          >
            <PlusCircle size={20} /> Buy
          </button>
        </div>
      ));
  };

  return (
    <div style={{ padding: "30px 20px", maxWidth: "600px", margin: "0 auto", background: "#121212", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={() => navigate("/scanner")}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ArrowLeft size={22} /> Back to Scanner
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20, color: "#fff" }}>
        <h1 style={{ fontSize: 36, marginBottom: 8, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <ShoppingCart size={36} /> Store
        </h1>
        <p style={{ fontSize: 18 }}>
          You have: <strong><Coin size={20} /> {coins}</strong>
        </p>
        {message && <p style={{ color: "#66ff66", fontWeight: "bold", fontSize: 16 }}>{message}</p>}
      </div>

      {/* Eggs */}
      <div style={{ marginTop: 24 }}>
        <button onClick={() => toggleCategory("egg")} style={categoryButtonStyle}>
          <Egg size={24} /> Eggs {expandedCategory === "egg" ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </button>
        {expandedCategory === "egg" && <div style={{ marginTop: 12 }}>{renderItems("egg")}</div>}
      </div>

      {/* Items (Coming Soon) */}
      <div style={{ marginTop: 24 }}>
        <button onClick={() => toggleCategory("item")} style={categoryButtonStyle}>
          <Pill size={24} /> Items (Coming Soon) {expandedCategory === "item" ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </button>
        {expandedCategory === "item" && (
          <div style={{ padding: 16, fontStyle: "italic", color: "#aaa", fontSize: 16 }}>
            No items available yet.
          </div>
        )}
      </div>

      {/* Scans */}
      <div style={{ marginTop: 24 }}>
        <button onClick={() => toggleCategory("scan")} style={categoryButtonStyle}>
          <Barcode size={24} /> Extra Scans {expandedCategory === "scan" ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </button>
        {expandedCategory === "scan" && <div style={{ marginTop: 12 }}>{renderItems("scan")}</div>}
      </div>
    </div>
  );
}

const categoryButtonStyle = {
  width: "100%",
  padding: 16,
  fontSize: 18,
  background: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #333",
  textAlign: "left",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  color: "#fff",
};
