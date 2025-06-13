export function getRewardFromBarcode(barcode) {
  const roll = Math.random();

  if (roll < 0.01) return { type: "egg" };               // 1% chance to get an egg
  if (roll < 0.11) return { type: "extraScans", amount: 3 }; // 10% chance
  if (roll < 0.25) return { type: "currency", amount: 100 }; // 14% chance
  return { type: "currency", amount: 10 };               // fallback: small coin reward
}
