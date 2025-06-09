export function getRewardFromBarcode(barcode) {
  const roll = Math.random();

  if (roll < 0.05) return { type: "egg", rarity: "rare", hatchScans: 20 };         // Top 5%
  if (roll < 0.10) return { type: "egg", rarity: "uncommon", hatchScans: 10 };     // Next 5%
  if (roll < 0.15) return { type: "egg", rarity: "common", hatchScans: 5 };        // Next 5%
  if (roll < 0.25) return { type: "currency", amount: 100 };                        // 10%
  if (roll < 0.40) return { type: "extraScans", amount: 3 };                        // 15%
  if (roll < 0.50) return { type: "currency", amount: 10 };                         // 10%
  if (roll < 0.75) return { type: "extraScans", amount: 2 };                        // 25%
  return { type: "currency", amount: 5 };                                           // 25%
}
