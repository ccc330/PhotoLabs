export interface GeneratedImage {
  original: string;
  generated: string;
}

export type GenerationStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export type View = 'home' | 'features' | 'about' | 'upload' | 'workspace';
