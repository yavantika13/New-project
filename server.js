import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const upload = multer();

app.post("/analyze-audio", upload.single("file"), async (req, res) => {
  try {
    const base64 = req.file.buffer.toString("base64");

    const response = await fetch(
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API?_KEY}`,
       // `https://echo-guard.onrender.com?key=${process.env.AIzaSyD07ioGBUPvrrUwX5koq84BsHdj2oq3H7A}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "This is wildlife forest audio. Detect tiger, chainsaw, gunshot, human or normal forest. Reply one word only."
                },
                {
                  inlineData: {
                    mimeType: "audio/wav",
                    data: base64
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const label =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown";

    res.json({ label });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3000, () => console.log("Echo-Guard AI running"));
