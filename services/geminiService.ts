import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to resize and compress image to avoid payload limits
const processImageForApi = (base64Str: string): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      // Resize to max dimension 1280px.
      // 1280px is more than enough for the AI to use as a reference (Identity/Composition),
      // but keeps the payload small enough to avoid XHR/RPC errors.
      const MAX_DIM = 1280;
      let width = img.width;
      let height = img.height;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to JPEG with 0.85 quality.
      // JPEG is much more efficient than PNG for photos.
      const newDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const data = newDataUrl.split(',')[1];
      resolve({ data, mimeType: 'image/jpeg' });
    };
    img.onerror = (e) => reject(e);
  });
};

export const generatePortraitImage = async (
  originalImageBase64: string,
  prompt: string
): Promise<string> => {
  const client = getClient();
  
  // Optimize image size and ensure correct format before sending
  const { data, mimeType } = await processImageForApi(originalImageBase64);

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              data: data,
              mimeType: mimeType
            }
          }
        ]
      },
      config: {
        imageConfig: {
          imageSize: '2K', // Explicitly request 2K resolution for output
          aspectRatio: '3:4', // Portrait orientation
        }
      }
    });

    // Check for image in response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image data received from the model.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Provide a more user-friendly error if we suspect payload issues
    if (error instanceof Error && (error.message.includes('Rpc failed') || error.message.includes('xhr error'))) {
       throw new Error("Network error: The image upload failed. Please try a smaller image or check your connection.");
    }
    throw error;
  }
};