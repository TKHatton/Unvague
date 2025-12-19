import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ContextMode, AnalysisResult } from "../types";

export async function analyzeInput(
  input: string | { data: string; mimeType: string },
  mode: ContextMode
): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  const isImage = typeof input !== 'string';
  
  const prompt = isImage 
    ? `Analyze the attached communication within a ${mode} context. If there is handwritten or printed text, OCR it first and then analyze the expectations. If there is no text, analyze the visual situation/context.`
    : `Analyze the following within a ${mode} context. 
       NOTE: If the input describes a situation/silence rather than a message, adjust the "whatWasSaid" section to "What was observed/described".
       
       INPUT:
       ${input}`;

  const contents = isImage 
    ? { parts: [ { inlineData: input }, { text: prompt } ] }
    : { parts: [{ text: prompt }] };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + `\n\nCONTEXT: ${mode}\nSTRICT RULE: Do not use idioms or metaphors. Use literal, concrete language.`,
      responseMimeType: "application/json",
      temperature: 0.1, 
    },
  });

  const responseText = response.text;
  
  if (!responseText || typeof responseText !== 'string' || responseText.trim().length === 0) {
    throw new Error("The translation engine returned an empty or invalid response. Please try again with more context.");
  }

  try {
    const rawData = JSON.parse(responseText);
    return {
      ...rawData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      originalText: isImage ? "[Image Content]" : input,
      mode,
    };
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    throw new Error("Clarity check failed. Try providing more context about who is involved.");
  }
}