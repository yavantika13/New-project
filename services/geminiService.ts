
import { GoogleGenAI, Type } from "@google/genai";
import { SoundType, RiskLevel, DetectionEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const DETECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { 
      type: Type.STRING, 
      description: "Classify the sound into: 'Wildlife', 'Chainsaw/Logging', 'Poaching/Gunshot', 'Forest Fire', or 'Normal Background'." 
    },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1." },
    details: { type: Type.STRING, description: "A brief description of the specific sound identified (e.g., 'Macaw call', 'Two-stroke engine', 'Gunshot')." },
    riskLevel: { type: Type.STRING, description: "Risk level: 'Low', 'Medium', 'High', or 'Critical'." }
  },
  required: ["type", "confidence", "details", "riskLevel"]
};

export async function analyzeForestAudio(base64Data: string, mimeType: string): Promise<Partial<DetectionEvent>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: "You are a wildlife conservation specialist. Analyze this forest audio clip. Identify if there are sounds of illegal logging, poaching, fire, or wildlife. Return the classification in JSON format."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: DETECTION_SCHEMA
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      type: result.type as SoundType,
      confidence: result.confidence,
      riskLevel: result.riskLevel as RiskLevel,
      details: result.details
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      type: SoundType.UNKNOWN,
      confidence: 0,
      riskLevel: RiskLevel.LOW,
      details: "Analysis failed due to sensor error."
    };
  }
}
