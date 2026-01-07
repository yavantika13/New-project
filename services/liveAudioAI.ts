// Sends live microphone audio to Gemini AI for sound detection

import { stopRecording } from "./micRecorder"

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function analyzeLiveAudio(): Promise<string> {
  const audioBlob = await stopRecording()

  const base64Audio = await blobToBase64(audioBlob)

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      GEMINI_API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "This is wildlife forest audio. Detect tiger, chainsaw, gunshot, human or normal forest. Reply in one word only.",
              },
              {
                inlineData: {
                  mimeType: "audio/wav",
                  data: base64Audio,
                },
              },
            ],
          },
        ],
      }),
    }
  )

  const data = await response.json()

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown sound"
  )
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      resolve(base64.split(",")[1])
    }
    reader.readAsDataURL(blob)
  })
}
