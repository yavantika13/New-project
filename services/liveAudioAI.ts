// // Sends live microphone audio to Gemini AI for sound detection

// import { stopRecording } from "./micRecorder"

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// export async function analyzeLiveAudio(): Promise<string> {
//   const audioBlob = await stopRecording()

//   const base64Audio = await blobToBase64(audioBlob)

//   const response = await fetch(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
//       GEMINI_API_KEY,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text:
//                   "This is wildlife forest audio. Detect tiger, chainsaw, gunshot, human or normal forest. Reply in one word only.",
//               },
//               {
//                 inlineData: {
//                   mimeType: "audio/wav",
//                   data: base64Audio,
//                 },
//               },
//             ],
//           },
//         ],
//       }),
//     }
//   )

//   const data = await response.json()

//   return (
//     data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown sound"
//   )
// }

// function blobToBase64(blob: Blob): Promise<string> {
//   return new Promise((resolve) => {
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       const base64 = reader.result as string
//       resolve(base64.split(",")[1])
//     }
//     reader.readAsDataURL(blob)
//   })
// }
//new

// import multer from "multer";
// import fetch from "node-fetch";

// const upload = multer();

// app.post("/analyze-audio", upload.single("file"), async (req, res) => {
//   try {
//     const buffer = req.file.buffer;
//     const base64 = buffer.toString("base64");

//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: "Detect sound: tiger, chainsaw, gunshot, human or normal forest. Reply one word."
//                 },
//                 {
//                   inlineData: {
//                     mimeType: "audio/wav",
//                     data: base64
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();
//     const label = data.candidates?.[0]?.content?.parts?.[0]?.text || "unknown";

//     res.json({
//       label,
//       confidence: Math.random() * 30 + 70 // fake confidence for demo
//     });

//   } catch (err) {
//     res.status(500).json({ error: "AI failed" });
//   }
// });

const API_URL = "https://echo-guard-backend.onrender.com/analyze-audio";

export async function analyzeLiveAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    // Expected response from backend:
    // { label: "Tiger", confidence: 0.92 }

    return data.label || "unknown";
  } catch (error) {
    console.error("Audio analysis failed:", error);
    return "error";
  }
}
