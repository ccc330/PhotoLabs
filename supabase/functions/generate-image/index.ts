import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenAI } from 'https://esm.sh/@google/genai@1';

export interface StyleVariable {
  key: string;
  label: string;
  choices: string[];
  originalText: string;
}

export interface PublicPortraitStyle {
  id: string;
  name: string;
  label: string;
  description: string;
  gradient: string;
  coverImage?: string;
  userInstruction: string;
  variables: StyleVariable[];
}

export interface GenerateImageRequest {
  styleId: string;
  imageBase64: string;
  variables: Record<string, string>;
}

export function buildPrompt(template: string, variables: Record<string, string>): string {
  let prompt = template;
  Object.entries(variables).forEach(([key, value]) => {
    const escapedKey = key.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    prompt = prompt.replace(new RegExp(escapedKey, 'g'), value);
  });
  return prompt;
}

export function parseVariables(template: string): StyleVariable[] {
  const regex = /\[(.*?)\]/g;
  const matches = [...template.matchAll(regex)];

  return matches.map((match, index) => {
    const originalText = match[0];
    return {
      key: `var_${index}`,
      label: `选项 ${index + 1}`,
      choices: match[1].split('/').map(s => s.trim()),
      originalText
    };
  });
}

// CORS 响应头配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
  'Access-Control-Max-Age': '86400'
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

// Gemini 客户端单例
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    geminiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  }
  return geminiClient;
}

serve(async (req) => {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const requestBody: GenerateImageRequest = await req.json();
    const { styleId, imageBase64, variables } = requestBody;

    // 处理 base64 数据：提取纯 base64（去除 Data URL 前缀）
    let pureBase64 = imageBase64;
    let mimeType = 'image/jpeg';

    if (imageBase64.includes(',')) {
      const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        pureBase64 = matches[2];
      }
    }

    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 从数据库获取风格定义
    const { data: style, error } = await supabase
      .from('styles')
      .select('prompt_template')
      .eq('id', styleId)
      .single();

    if (error || !style) {
      return new Response(
        JSON.stringify({ success: false, error: 'Style not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 构建提示词
    const prompt = buildPrompt(style.prompt_template, variables);

    // 调用 Gemini API
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: pureBase64, mimeType: mimeType } }
        ]
      },
      config: {
        imageConfig: {
          imageSize: '2K',
          aspectRatio: '3:4'
        }
      }
    });

    // 提取生成的图片
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          const generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          return new Response(
            JSON.stringify({ generatedImage }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    throw new Error('No image data received from model');
  } catch (error: any) {
    console.error('Generation error:', error);

    // 错误信息脱敏
    const userMessage = error.message?.includes('403')
      ? 'API key validation failed'
      : error.message?.includes('Rpc failed')
      ? 'Network error: Image upload failed'
      : 'Image generation failed';

    return new Response(
      JSON.stringify({ success: false, error: userMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
