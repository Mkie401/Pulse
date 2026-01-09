import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

// Ensure API key is available
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateTaskSuggestions = async (context: string): Promise<string[]> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock data.");
    return [
      "分析對手戰術數據",
      "優化網路延遲 ping 值",
      "招募新隊員"
    ];
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 tactical, gaming, or sci-fi mission objectives in Traditional Chinese (繁體中文) based on: "${context}". Return ONLY a JSON array of strings. Keep it brief and technical. Example: ["防禦矩陣部署", "資源採集"].`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["系統診斷", "防火牆更新", "數據備份"];
  }
};

export const generateChatReply = async (history: string[], userMessage: string): Promise<string> => {
    if (!ai) {
        return "系統提示：AI 模組離線。請輸入 API Key 以重新連線。";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are "Pulse Tactical AI", a cold, efficient, and precise system operator for a futuristic gaming squad.
            
            Conversation context:
            ${history.join('\n')}
            
            User says: "${userMessage}"
            
            Reply in Traditional Chinese (繁體中文). Use military/sci-fi jargon (e.g., "收到", "確認", "執行中"). Keep it brief and cool.`,
        });
        return response.text || "指令無效。";
    } catch (error) {
        console.error("Gemini Chat Error", error);
        return "錯誤：連線中斷。";
    }
}