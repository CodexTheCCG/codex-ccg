import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST /generate-sprite
app.post('/generate-sprite', async (req, res) => {
  const { scannedItem, rarity } = req.body;

  const prompt = `pixel art sprite of a ${rarity} fantasy creature inspired by a ${scannedItem}. 64x64, transparent background`;

  try {
    const imageResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "64x64",
      response_format: "b64_json",
    });

    const base64 = imageResponse.data.data[0].b64_json;

    const monsterName = generateNameFromItem(scannedItem);
    const spriteId = Date.now();

    // Optionally save to Firebase/Storage here

    return res.json({
      spriteId,
      creatureName: monsterName,
      base64, // or URL if you upload it
    });
  } catch (error) {
    console.error("Image generation failed", error.message);
    res.status(500).json({ error: "Failed to generate sprite." });
  }
});

function generateNameFromItem(item) {
  const base = item.replace(/[^a-z]/gi, "").slice(0, 10);
  return base.charAt(0).toUpperCase() + base.slice(1) + Math.floor(Math.random() * 1000);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Sprite generator running on port ${PORT}`));
