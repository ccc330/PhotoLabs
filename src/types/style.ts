// 数据库中的完整风格定义（仅后端使用）
export interface DatabaseStyle {
  id: string;
  name: string;
  label: string;
  description: string;
  gradient: string;
  cover_image: string | null;
  user_instruction: string;
  prompt_template: string;  // 敏感字段，前端不直接访问
  created_at: string;
  updated_at: string;
}

// 前端接收的公开风格定义
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

export interface StyleVariable {
  key: string;
  label: string;
  choices: string[];
}

// 保留旧接口以保持兼容性（后续可删除）
export interface StyleOption {
  key: string;
  label: string;
  choices: string[];
  originalText?: string;
}

export interface PortraitStyle {
  id: string;
  name: string;
  label: string;
  description: string;
  gradient: string;
  coverImage?: string;
  userInstruction: string;
  promptTemplate: string;
}
