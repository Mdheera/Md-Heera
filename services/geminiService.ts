
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Always initialize the client with the provided API key from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an automated insight ("Scholar Pulse") for a student based on their academic and attendance data.
 */
export const getAutoInsight = async (studentData: any, lang: Language) => {
  try {
    const prompt = `
      Analyze this student's performance holistically.
      Data: ${JSON.stringify(studentData)}
      Context: This is a school in Bihar, India.
      Goal: Provide a concise, high-impact "Scholar Pulse" (3-4 lines).
      Correlation Task: Relate their Attendance percentage to their Marks and the Teacher's Monthly Feedback.
      Language: ${lang === 'hi' ? 'Simple Hindi' : lang === 'hinglish' ? 'Hinglish (Hindi in English script)' : 'Professional English'}.
      Tone: Growth-oriented, specific, and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the ResultSaathi Intelligence Engine. You convert raw academic data into actionable pedagogical insights. Never mention being an AI.",
        temperature: 0.4,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getAutoInsight:", error);
    return "Intelligence sync in progress...";
  }
};

/**
 * Generates strategic priorities for school leadership based on institutional statistics.
 */
export const getStrategicInstitutionalInsight = async (schoolStats: any, lang: Language) => {
  try {
    const prompt = `
      As a Senior Pedagogical Strategist, analyze these school-wide stats: ${JSON.stringify(schoolStats)}.
      Identify the top 2 strategic priorities for the Principal.
      Language: ${lang}.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are a professional educational consultant for school principals in India.",
        temperature: 0.5 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getStrategicInstitutionalInsight:", error);
    return "Analyzing institutional trends...";
  }
};

/**
 * Enhances raw teacher feedback into professional and constructive comments.
 * Fixed: Added missing export required by MonthlyFeedback.tsx.
 */
export const getEnhancedFeedback = async (comment: string, lang: Language) => {
  try {
    const prompt = `
      You are a wise and encouraging school teacher in Bihar, India.
      The following is a raw observation about a student: "${comment}"
      
      Improve this feedback to be more constructive, professional, and growth-oriented while remaining grounded in the local context.
      
      Language: ${lang === 'hi' ? 'Simple Hindi' : lang === 'hinglish' ? 'Hinglish (Hindi in English script)' : 'Professional English'}.
      Keep it to 2-3 sentences.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert pedagogical assistant. You help teachers communicate student progress effectively.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getEnhancedFeedback:", error);
    return comment; // Return original comment if processing fails
  }
};
