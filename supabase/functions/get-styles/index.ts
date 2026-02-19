import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

serve(async (req) => {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // 创建 Supabase 客户端（使用 Service Role Key 访问所有数据）
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 从数据库获取所有风格（包含 prompt_template），按创建时间降序排列（新风格在前）
    const { data: styles, error } = await supabase
      .from('styles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch styles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 解析每个风格的变量并返回公开版本
    const publicStyles: PublicPortraitStyle[] = (styles || []).map(style => ({
      id: style.id,
      name: style.name,
      label: style.label,
      description: style.description,
      gradient: style.gradient,
      coverImage: style.cover_image,
      userInstruction: style.user_instruction,
      variables: parseVariables(style.prompt_template)  // 在后端解析变量
    }));

    return new Response(
      JSON.stringify(publicStyles),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
