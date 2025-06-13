// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createCreatureRouter from "./createCreature.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ This defines the route: http://localhost:3001/generate
app.use("/generate", createCreatureRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🟢 Backend running at http://localhost:${PORT}`);
});
