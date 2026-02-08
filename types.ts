export interface StyleOption {
  key: string;
  label: string;
  choices: string[];
}

export interface PortraitStyle {
  id: string;
  name: string; // Internal English name
  label: string; // Chinese UI label
  description: string; // Chinese description
  gradient: string; // CSS Gradient class for UI card
  userInstruction: string;
  promptTemplate: string;
}

export interface GeneratedImage {
  original: string; // Base64
  generated: string; // Base64 or URL
}

export type GenerationStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';