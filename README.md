# PhotoLabs AI

AI 驱动的艺术人像创作工具，基于 Google Gemini 3 Pro 视觉模型。

## 功能特性

- **Gemini 3 Pro 视觉模型** - 采用 Google 最新一代视觉生成模型，精准理解人物特征并生成 2K 高清艺术作品
- **精选艺术风格** - 内置 6 款专业调校的艺术风格，涵盖电影叙事、赛博朋克、极简光影等流派
- **安全云端架构** - 基于 Supabase 云平台，API 密钥与提示词模板完全由服务端管理
- **简洁创作流程** - 三步完成创作：选择风格 → 上传照片 → 调整参数

## 艺术风格

| 风格 | 描述 |
| ------ | ------ |
| 手绘拼贴艺术 | 黑白胶片质感结合手绘剪贴元素，打造独特的设计感海报风格 |
| 电影叙事三连拍 | 充满情感的电影镜头语言，通过三段式构图讲述光影与风的故事 |
| 城市霓虹夜景 | 赛博朋克风格的都市夜景，迷离的霓虹光影映衬出人物的神秘感 |
| 胶片慢门抓拍 | 模拟复古相机的慢门效果，充满动态模糊与情绪感的瞬间捕捉 |
| 极简光影剪影 | 利用强烈的单一光源创造戏剧性的投影，极简而富有张力 |
| 冷调建筑美学 | 置身于宏大的现代主义建筑中，冷峻的色调展现理性的几何美感 |

## 技术栈

### 前端

- React 19 + Vite
- Tailwind CSS
- TypeScript

### 后端

- Supabase Edge Functions (Deno)
- PostgreSQL

### AI

- Google Gemini 3 Pro 视觉模型

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ccc330/PhotoLabs.git
cd PhotoLabs
npm install
```

### 2. 配置环境变量

复制环境变量模板并填入配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 <http://localhost:3000>

## Supabase 后端部署

### 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 在 Project Settings → API 获取：
   - Project URL
   - Anon Public Key
   - Service Role Key

### 配置 Edge Functions 环境变量

在 Supabase Dashboard → Settings → Edge Functions 添加：

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 执行数据库迁移

```bash
# 使用 Supabase CLI
supabase login
supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

或通过 Supabase Dashboard → SQL Editor 执行 `supabase/migrations/001_create_styles_table.sql`

### 部署 Edge Functions

```bash
npx supabase functions deploy get-styles
npx supabase functions deploy generate-image
```

## 项目结构

```text
PhotoLabs/
├── src/
│   ├── components/          # UI 组件
│   │   ├── generation/      # 生成按钮、进度指示
│   │   ├── image-upload/    # 图片上传
│   │   ├── layout/          # 页面布局、导航
│   │   ├── pages/           # 功能页、关于页
│   │   ├── parameter-input/ # 参数表单
│   │   ├── result-display/  # 图片对比、下载
│   │   ├── style-selector/  # 风格选择
│   │   └── ui/              # 通用图标组件
│   ├── services/            # API 服务层
│   ├── types/               # TypeScript 类型定义
│   ├── constants/           # 风格配置
│   └── utils/               # 工具函数
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── get-styles/      # 获取风格列表
│   │   └── generate-image/  # 生成图片
│   └── migrations/          # 数据库迁移
└── public/                  # 静态资源
```

## 安全架构

- **API 密钥隔离** - Gemini API 密钥仅存储在 Supabase Edge Functions 环境变量中
- **提示词保护** - 提示词模板存储在数据库，前端仅接收解析后的参数选项
- **错误信息脱敏** - 服务端错误信息经过处理后返回，不泄露内部细节
- **降级机制** - Edge Function 不可用时自动切换到本地数据模式

## 使用声明

生成图片仅供个人娱乐与非商业用途。AI 生成内容可能存在不可预测性，请勿上传涉及隐私、暴力或版权争议的照片。使用本服务即表示您同意遵守 [Google Generative AI 使用条款](https://ai.google.dev/terms)。

## License

MIT
