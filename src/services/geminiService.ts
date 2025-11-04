import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const styleResponseSchema = {
    type: Type.OBJECT,
    properties: {
        description: {
            type: Type.STRING,
            description: "A short, witty, one-sentence description of the art style."
        },
        prompt: {
            type: Type.STRING,
            description: "A detailed, effective prompt for an AI image generator, as a comma-separated list of keywords and phrases, encapsulating the core visual elements of the style."
        }
    },
    required: ["description", "prompt"],
};

export const generateCartoonStyleDetails = async (styleName: string): Promise<{ description: string; prompt: string; }> => {
    try {
        const promptContent = `You are an expert prompt engineer specializing in artistic styles for AI image generation.
        Analyze the core visual characteristics of the style: "${styleName}".
        Generate a short, witty, one-sentence description of this art style.
        Then, create a detailed and effective prompt for an AI image generator. The prompt should be a comma-separated list of keywords, phrases, and artistic techniques that captures the absolute essence of the style. Focus on elements like line work, color palette, shading, character proportions, and overall mood.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptContent,
            config: {
                responseMimeType: "application/json",
                responseSchema: styleResponseSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed && typeof parsed === 'object' && 'description' in parsed && 'prompt' in parsed) {
            return parsed as { description: string; prompt: string; };
        } else {
            throw new Error("The AI response was missing required fields.");
        }
    } catch (error) {
        console.error(`Error generating style details for ${styleName}:`, error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error('The provided API Key is not valid. Please check your credentials.');
        }
        throw new Error(`Failed to generate details for ${styleName}. The model may be overloaded, or there might be an issue with the API key.`);
    }
};

// FIX: Added generateColorPalette function to resolve import error in Builder.tsx.
const colorPaletteSchema = {
    type: Type.OBJECT,
    properties: {
        accent: {
            type: Type.STRING,
            description: "A vibrant accent color in hex format (e.g., #D7EB4A)."
        },
        background: {
            type: Type.STRING,
            description: "A dark, modern background color in hex format for a UI component (e.g., #111827)."
        },
        text: {
            type: Type.STRING,
            description: "A readable text color in hex format that contrasts well with the background (e.g., #9CA3AF)."
        }
    },
    required: ["accent", "background", "text"],
};

export const generateColorPalette = async (): Promise<{ accent: string; background: string; text: string; }> => {
    try {
        const prompt = "Generate a modern and stylish color palette for a UI component. Provide a dark background, a vibrant accent, and a suitable text color.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: colorPaletteSchema,
                temperature: 1,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed && typeof parsed === 'object' && 'accent' in parsed && 'background' in parsed && 'text' in parsed) {
            return parsed as { accent: string; background: string; text: string; };
        } else {
            throw new Error("The AI response was missing required color fields.");
        }
    } catch (error) {
        console.error('Error generating color palette:', error);
        throw new Error('Failed to generate a new color palette. The model may be busy.');
    }
};

export const cartoonifyImage = async (base64ImageData: string, mimeType: string, stylePrompt: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType,
            },
        };
        const textPart = {
            text: `Transform this user's photo into a vibrant piece of art. Recreate it in the following artistic style: '${stylePrompt}'. Focus on capturing the essence of the style's iconic line work, color palette, and character design. The final output must be a high-resolution image that creatively interprets the original photo. Do not return text.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const imageResponsePart = response.candidates?.[0]?.content?.parts?.[0];
        if (imageResponsePart?.inlineData?.data) {
            return `data:${imageResponsePart.inlineData.mimeType};base64,${imageResponsePart.inlineData.data}`;
        } else {
            // Check for safety ratings or other block reasons
            const blockReason = response.candidates?.[0]?.finishReason;
            if (blockReason === 'SAFETY') {
                 throw new Error("Image generation was blocked for safety reasons. Please try a different image.");
            }
            throw new Error("The model did not return a valid image. It might be too busy.");
        }
    } catch (error) {
        console.error('Error cartoonifying image:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to generate the cartoon image. Please try a different image or style.');
    }
}
