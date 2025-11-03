import { GoogleGenAI, Modality } from "@google/genai";
import { Theme } from '../types';

const dataUrlToPart = (dataUrl: string) => {
  const [meta, base64Data] = dataUrl.split(',');
  const mimeType = meta.split(';')[0].split(':')[1];
  if (!mimeType || !base64Data) {
    throw new Error('Invalid data URL format for image processing.');
  }
  return {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };
};

export const generateCartoonImage = async (originalImage: string, theme: Theme): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = dataUrlToPart(originalImage);
    const textPart = { text: theme.prompt };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imageResponsePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imageResponsePart?.inlineData) {
      const { mimeType, data } = imageResponsePart.inlineData;
      return `data:${mimeType};base64,${data}`;
    } else {
      throw new Error('No image was generated. The model may have refused the request due to safety policies or an unclear prompt.');
    }
  } catch (error) {
    console.error('Error in generateCartoonImage:', error);
    if (error instanceof Error) {
        if (error.message.includes('xhr error') || error.message.includes('API key not valid')) {
            throw new Error('A network error occurred or the API key is invalid. Please check your connection and configuration.');
        }
        throw error;
      }
    throw new Error('An unknown error occurred during image generation.');
  }
};
