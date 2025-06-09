export async function generateCreatureSpriteForEgg(egg) {
  const prompt = `64x64 pixel sprite of a fantasy creature, cute, ${egg.rarity}, video game style`;

  const res = await fetch("/api/generateSprite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("Failed to generate sprite");
  const { spriteId, base64 } = await res.json();

  // Optionally store base64 in localStorage (or a real image host)
  const monster = {
    id: spriteId,
    creatureName: `Creature-${spriteId.slice(-4)}`,
    base64,
  };

  return monster;
}
