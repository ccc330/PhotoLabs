import { supabase } from './supabase';
import { PORTRAIT_STYLES, STYLE_TEMPLATES } from '@/constants/portrait-styles';
import { PublicPortraitStyle } from '@/types';

interface GenerateImageRequest {
  styleId: string;
  imageBase64: string;
  variables: Record<string, string>;
}

// 构建提示词（替换变量）
function buildPrompt(template: string, variables: Record<string, string>): string {
  let prompt = template;
  Object.entries(variables).forEach(([, value]) => {
    // 匹配 [option1/option2/option3] 格式的变量
    const regex = /\[([^\]]*?\b${value}\b[^\]]*?)\]/g;
    prompt = prompt.replace(regex, value);
  });
  // 移除未替换的变量占位符
  prompt = prompt.replace(/\[([^\]]+)\]/g, (_, content) => {
    const options = content.split('/').map((s: string) => s.trim());
    return options[0]; // 使用第一个选项作为默认值
  });
  return prompt;
}

export const apiService = {
  /**
   * 获取风格列表（优先从 Edge Function 获取，失败时使用本地数据）
   */
  async fetchStylesWithVariables(): Promise<PublicPortraitStyle[]> {
    try {
      // 尝试从 Edge Function 获取
      const { data, error } = await supabase.functions.invoke('get-styles');

      if (error) {
        console.warn('Edge Function 不可用，使用本地风格数据:', error.message);
        // 降级到本地数据
        return PORTRAIT_STYLES;
      }

      return data || PORTRAIT_STYLES;
    } catch (err) {
      console.warn('获取风格列表失败，使用本地数据:', err);
      // 降级到本地数据
      return PORTRAIT_STYLES;
    }
  },

  /**
   * 生成图片（优先使用 Edge Function，失败时使用本地模板）
   */
  async generateImage(request: GenerateImageRequest): Promise<string> {
    const { styleId, imageBase64, variables } = request;

    try {
      // 尝试使用 Edge Function
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: request
      });

      if (error) {
        console.warn('Edge Function 不可用，使用本地模式:', error.message);
        // 降级到本地生成（如果 Edge Function 不可用）
        return this.generateLocally(styleId, imageBase64, variables);
      }

      return data?.generatedImage || '';
    } catch (err) {
      console.warn('生成图片失败，尝试本地模式:', err);
      // 降级到本地生成
      return this.generateLocally(styleId, imageBase64, variables);
    }
  },

  /**
   * 本地生成模式（使用 Gemini API 直接调用）
   */
  async generateLocally(styleId: string, imageBase64: string, variables: Record<string, string>): Promise<string> {
    const template = STYLE_TEMPLATES[styleId];

    if (!template) {
      throw new Error(`未找到风格模板: ${styleId}`);
    }

    const prompt = buildPrompt(template, variables);

    // 提取 base64 数据
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';

    // 调用 Gemini API
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        imageBase64: base64Data,
        mimeType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `生成失败: ${response.status}`);
    }

    const result = await response.json();
    return result.generatedImage || '';
  }
};
