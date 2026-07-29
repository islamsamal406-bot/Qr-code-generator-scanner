import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Helper API - Format text into structured vCard or Wi-Fi data
  app.post("/api/ai/format-data", async (req, res) => {
    try {
      const { prompt, type } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert data formatter for QR code generators.
Extract and format the user's input into structured JSON for a ${type || "general"} QR code.
User input: "${prompt}"

Return ONLY a raw valid JSON object without markdown formatting (no \`\`\`json).
If type is "vcard":
{
  "firstName": "", "lastName": "", "organization": "", "title": "",
  "phone": "", "email": "", "mobile": "", "address": "", "website": "", "note": ""
}
If type is "wifi":
{
  "ssid": "", "password": "", "encryption": "WPA" | "WEP" | "nopass", "hidden": false
}
If type is "event":
{
  "title": "", "startDate": "YYYY-MM-DDTHH:mm", "endDate": "YYYY-MM-DDTHH:mm", "location": "", "description": ""
}
Otherwise:
{
  "formattedText": "Clean formatted text"
}`,
      });

      const rawText = response.text || "";
      const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let parsed;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (err) {
        parsed = { formattedText: rawText };
      }

      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("AI format error:", error);
      return res.status(500).json({ error: error.message || "Failed to process AI request" });
    }
  });

  // AI Analyze Scanned QR Code
  app.post("/api/ai/analyze-qr", async (req, res) => {
    try {
      const { qrContent } = req.body;
      if (!qrContent) {
        return res.status(400).json({ error: "QR content is required" });
      }

      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Analyze this QR code content for security, intent, and summary:
"${qrContent}"

Provide a JSON object (no markdown formatting) with:
{
  "summary": "Clear human-readable summary of what this QR code contains",
  "category": "URL | Wi-Fi | Contact | Payment | Text | Other",
  "securityAssessment": "SAFE | UNKNOWN | POTENTIAL_RISK",
  "safetyNotes": "Brief safety advisory or instructions for the user",
  "suggestedActions": ["Action 1", "Action 2"]
}`,
      });

      const rawText = response.text || "";
      const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (err) {
        parsed = {
          summary: qrContent,
          category: "Text",
          securityAssessment: "SAFE",
          safetyNotes: "Standard text content.",
          suggestedActions: ["Copy Text"]
        };
      }

      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("AI analyze error:", error);
      return res.status(500).json({ error: error.message || "Failed to analyze QR content" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
