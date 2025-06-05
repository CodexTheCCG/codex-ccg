import { useState } from "react";
import Scanner from "./Scanner";
import { getRewardFromBarcode } from "./rewards";

export default function ScannerScreen() {
  const [reward, setReward] = useState(null);
  const [lastCode, setLastCode] = useState(null);

  const handleScan = (barcode) => {
    if (barcode === lastCode) return;
    setLastCode(barcode);
    const result = getRewardFromBarcode(barcode);
    setReward(result);
  };

  return (
    <div style={styles.page}>
      <div style={styles.scannerWrapper}>
        <Scanner onScan={handleScan} />
      </div>

      <div style={styles.content}>
        {reward && (
          <div style={styles.rewardBox}>
            <h2>🎁 You got: <span style={{ color: '#007bff' }}>{reward.type}</span></h2>
            <pre style={styles.rewardDetails}>{JSON.stringify(reward, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    margin: 0,
    padding: 0,
    backgroundColor: "#fff",
    fontFamily: "sans-serif",
  },
  scannerWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "240px",
    backgroundColor: "#000",
    zIndex: 1,
  },
  content: {
    marginTop: "260px",
    padding: "16px",
    textAlign: "center",
  },
  rewardBox: {
    padding: "16px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    display: "inline-block",
  },
  rewardDetails: {
    textAlign: "left",
    fontSize: "0.9rem",
    marginTop: "10px",
  },
};
