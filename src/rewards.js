export function getRewardFromBarcode(barcode) {
  const roll = Math.random();

  if (roll < 0.01) return { type: "egg", rarity: "hyper-rare" };
  if (roll < 0.05) return { type: "monster", rarity: "rare" };
  if (roll < 0.3) return { type: "currency", amount: 100 };
  return { type: "steps", amount: 25 };
}
