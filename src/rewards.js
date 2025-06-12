export function getRewardFromBarcode(barcode) {
  const roll = Math.random();

  // 🥚 About 7% chance to get an egg (with small chance of ascended later)
  if (roll < 0.10) return { type: "egg", hatchScans: 15 };

  // 💰📈 Other rewards (~93%)
  if (roll < 0.17) return { type: "currency", amount: 100 };     // 10%
  if (roll < 0.42) return { type: "currency", amount: 5 };      // 10%
  if (roll < 0.32) return { type: "extraScans", amount: 2 };     // 15%
  if (roll < 0.67) return { type: "extraScans", amount: 1 };     // 25%
  return { type: "currency", amount: 1 };                        // ~33%
}
