export function getRewardFromBarcode(barcode) {
  const roll = Math.random();

  if (roll < 0.0001111) return { type: "egg", rarity: "hyper rare", hatchScans: 250 };
  if (roll < 0.0101111) return { type: "egg", rarity: "rare", hatchScans: 100 };
  if (roll < 0.0301111) return { type: "egg", rarity: "uncommon", hatchScans: 40 };
  if (roll < 0.0701111) return { type: "egg", rarity: "common", hatchScans: 15 };

  // Remaining ~92.99% of rewards
  if (roll < 0.1701111) return { type: "currency", amount: 100 };     // 10%
  if (roll < 0.3201111) return { type: "extraScans", amount: 5 };     // 15%
  if (roll < 0.4201111) return { type: "currency", amount: 10 };      // 10%
  if (roll < 0.6701111) return { type: "extraScans", amount: 2 };     // 25%
  return { type: "currency", amount: 5 };                              // ~33%
}
