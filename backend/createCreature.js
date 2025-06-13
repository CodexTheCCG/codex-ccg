// backend/createCreature.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { scannedItem } = req.body;
  console.log("🛰️ Received scanned item:", scannedItem);

  try {
    // ... your name + image generation logic
    const nameResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You're a monster creator for a fantasy creature game." },
        { role: "user", content: `Create a unique, cool creature name based on: ${scannedItem}` }
      ],
    });

    const creatureName = nameResponse.choices[0].message.content.trim();

    const normalRes = await openai.images.generate({
      prompt: `pixel art of a fantasy creature named ${creatureName}, inspired by ${scannedItem}, 64x64 sprite, transparent background, full body`,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    const shinyRes = await openai.images.generate({
      prompt: `shiny version of a pixel art fantasy creature named ${creatureName}, glowing, gold tones, radiant, full body, 64x64 sprite, transparent background`,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    res.json({
      creatureName,
      normalSprite: normalRes.data[0].b64_json,
      shinySprite: shinyRes.data[0].b64_json
    });

  } catch (err) {
    console.error("❌ Error generating creature:", err);
    res.status(500).json({ error: "Failed to generate creature." });
  }
});

export default router;
