import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ContextMode, AnalysisResult } from "../types";

export async function analyzeInput(
  input: string | { data: string; mimeType: string },
  mode: ContextMode
): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error("API key not configured. Please set VITE_API_KEY in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\n\nCONTEXT: ${mode}\nSTRICT RULE: Do not use idioms or metaphors. Use literal, concrete language.`,
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    });

    if (!response || !response.text) {
      throw new Error("API returned empty response");
    }

    return processResponse(response.text, isImage, input, mode);
  } catch (error: any) {
    // Handle API-level errors
    if (error.message?.includes('API_KEY')) {
      throw new Error("API configuration error. Please check your API key setup.");
    }
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      throw new Error("Service temporarily unavailable due to high demand. Please try again in a moment.");
    }
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error("Network connection issue. Please check your internet connection and try again.");
    }
    throw error;
  }
}

function processResponse(
  responseText: string,
  isImage: boolean,
  input: string | { data: string; mimeType: string },
  mode: ContextMode
): AnalysisResult {
  if (!responseText || typeof responseText !== 'string' || responseText.trim().length === 0) {
    throw new Error("The translation engine returned an empty or invalid response. Please try again with more context.");
  }

  try {
    const rawData = JSON.parse(responseText);

    // Validate required fields exist
    if (!rawData.whatWasSaid || !rawData.whatIsExpected) {
      throw new Error("Response missing required analysis fields");
    }

    return {
      ...rawData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      originalText: isImage ? "[Image Content]" : (typeof input === 'string' ? input : "[Image Content]"),
      mode,
    };
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response:", responseText);

    // Check if response was blocked by safety filters
    if (responseText.toLowerCase().includes('safety') ||
        responseText.toLowerCase().includes('blocked') ||
        responseText.toLowerCase().includes('filter')) {
      throw new Error("The AI filtered this content as potentially sensitive. Try rephrasing or removing identifying details.");
    }

    // If the response is plain text (not JSON), provide it directly
    if (responseText.length > 0 && !responseText.trim().startsWith('{')) {
      throw new Error(`The translation engine returned an unexpected format. Raw response: ${responseText.substring(0, 200)}...`);
    }

    throw new Error("Unable to parse the translation. The content may be too ambiguous or lack sufficient context. Try adding more detail about the situation.");
  }
}