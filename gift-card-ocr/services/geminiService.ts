import { GoogleGenAI, Type } from "https://aistudiocdn.com/@google/genai@^1.29.0";
import type { GiftCardData } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  const base64Data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
};

// FIX: The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
export const extractGiftCardInfo = async (imageFile: File): Promise<Partial<GiftCardData>> => {
  // FIX: Initialize GoogleGenAI with API key from environment variable, as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);
  const prompt = "請從這張圖片中提取點數卡的序號和密碼。序號通常標示為 '序號' 或 'SN'。密碼通常標示為 '密碼'、'Password' 或 'PIN'。如果找不到特定欄位，請回傳空字串。";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            serialNumber: {
              type: Type.STRING,
              description: '點數卡的序號'
            },
            password: {
              type: Type.STRING,
              description: '點數卡的密碼'
            }
          },
          required: ['serialNumber', 'password']
        }
      }
    });

    const parsedJson = JSON.parse(response.text);
    return {
        serialNumber: parsedJson.serialNumber || 'N/A',
        password: parsedJson.password || 'N/A',
    };
  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        // FIX: Update error message to reflect API key is from environment.
        throw new Error("環境變數中的 API 金鑰無效。");
    }
    throw new Error("AI 模型處理圖片時發生錯誤。");
  }
};
