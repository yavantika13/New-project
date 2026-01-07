
import { GoogleGenAI, Type } from "@google/genai";
import { SoundType, RiskLevel, DetectionEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const DETECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { 
      type: Type.STRING, 
      description: "Classify into: 'Wildlife', 'Chainsaw/Logging', 'Poaching/Gunshot', 'Forest Fire', 'Vehicle Intrusion', 'Human Presence', or 'Normal Background'." 
    },
    detectedSound: {
      type: Type.STRING,
      description: "Specific sound identified, e.g., 'chainsaw', 'gunshot', 'elephant roar', 'truck engine', 'axe impact'."
    },
    detectedSpecies: {
      type: Type.STRING,
      description: "Specific animal species if applicable (Tiger, Elephant, Bird, Frog, Insect, Dog)."
    },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1." },
    details: { type: Type.STRING, description: "Short summary of the event." },
    explanation: { type: Type.STRING, description: "A brief AI explanation of what was heard and its environmental context." },
    riskLevel: { type: Type.STRING, description: "Risk level: 'Low', 'Medium', 'High', or 'Critical'." },
    status: {
      type: Type.STRING,
      description: "Status based on threat: 'Under Threat', 'Wildlife Activity', 'Safe', or 'Caution'."
    }
  },
  required: ["type", "detectedSound", "confidence", "details", "explanation", "riskLevel", "status"]
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
            text: `You are ECHO-GUARD, an expert AI forest surveillance system. Analyze this audio.
            Detect:
            - Forest Cutting (chainsaw, axe, tree falling) -> Logging
            - Gunshot (poaching) -> Poaching
            - Vehicle movement -> Vehicle Intrusion
            - Human shouting -> Human Presence
            - Tiger, Elephant, Bird, Frog, Insect -> Wildlife
            - Normal forest sounds -> Background

            Alert rules:
            - Forest Cutting or Gunshot -> High/Critical risk if confidence > 0.6
            - Vehicle/Human -> Medium risk if confidence > 0.6
            - Tiger/Elephant -> Wildlife alert if confidence > 0.7

            Return response in the specified JSON format.`
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
      detectedSound: result.detectedSound,
      detectedSpecies: result.detectedSpecies,
      confidence: result.confidence,
      riskLevel: result.riskLevel as RiskLevel,
      details: result.details,
      explanation: result.explanation,
      status: result.status
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      type: SoundType.UNKNOWN,
      detectedSound: "Unknown",
      confidence: 0,
      riskLevel: RiskLevel.LOW,
      details: "Analysis failed.",
      explanation: "Sensor encountered a neural processing error.",
      status: "Safe"
    };
  }
}
