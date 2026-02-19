# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhotoLabs AI is a portrait image generation tool built with React + Vite, powered by Google Gemini 3 Pro AI model. Users upload a photo, select an artistic style, customize parameters, and generate AI-enhanced portraits.

**Architecture**: Supabase backend with Edge Functions. API keys and prompt templates are stored server-side; the frontend only receives non-sensitive data.

## Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build

# Supabase CLI (for backend changes)
npx supabase functions deploy get-styles      # Deploy styles API
npx supabase functions deploy generate-image  # Deploy image generation API
```

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Configure Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. In Supabase Dashboard → Settings → Edge Functions, add:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

## Architecture

### Backend: Supabase Edge Functions

Two Deno-based Edge Functions handle all server-side logic:

- **`get-styles`**: Fetches styles from database, parses `[option1/option2]` variables, returns `PublicPortraitStyle[]` without `prompt_template`
- **`generate-image`**: Receives styleId + variables, builds prompt from database template, calls Gemini API

The Gemini API key is stored in Supabase environment variables and never exposed to the frontend.

### Frontend: API Service with Fallback

[api.ts](src/services/api.ts) implements a fallback strategy:

1. Try Edge Function first
2. On failure, fall back to local data from [portrait-styles.ts](src/constants/portrait-styles.ts)

This enables development without Supabase running.

### Dynamic Prompt System

Prompt templates use `[option1/option2/option3]` syntax for user-customizable parameters:

- **Parsing**: [`parseVariables()`](supabase/functions/get-styles/index.ts#L38-L50) extracts options into `StyleVariable[]`
- **Building**: [`buildPrompt()`](supabase/functions/generate-image/index.ts#L29-L36) replaces `[...]` placeholders with user selections
- **Frontend Display**: Variables are rendered as dropdown selects in [DynamicForm.tsx](src/components/parameter-input/DynamicForm.tsx)

### Type System

Two style interfaces with different sensitivity levels:

- **`DatabaseStyle`** ([types/style.ts](src/types/style.ts)): Full schema including `prompt_template` (server-only)
- **`PublicPortraitStyle`**: Safe subset with `variables[]` instead of raw template (client-safe)

### View State Machine

[App.tsx](src/App.tsx) manages navigation with a single `currentView` state:

```text
home → upload → workspace
  ↓       ↓
features  about
```

### Path Aliases

Configured in [vite.config.ts](vite.config.ts):

- `@/` → `src/`
- `@/components`, `@/services`, `@/types`, `@/constants`, `@/utils`

## Adding a New Style

**重要**: 新增风格需要**同时**修改本地数据和 Supabase 数据库，因为生产环境优先使用 Edge Function 数据。

### Step 1: 本地数据 (portrait-styles.ts)

在 [portrait-styles.ts](src/constants/portrait-styles.ts) 的 `RAW_STYLES` 数组**开头**插入新风格：

```typescript
{
  id: 'style_XX',
  name: 'English Name',
  label: '中文名称',
  description: '风格描述',
  gradient: 'from-red-500 to-red-700',
  coverImage: '/images_style-examples/style-examples_XX.jpg',
  userInstruction: '上传要求说明',
  promptTemplate: `完整的 AI prompt 模板`
}
```

**注意**:
- 在数组开头插入才能显示在最前面（本地降级模式）
- `coverImage` 路径: `/images_style-examples/style-examples_XX.jpg`
- 图片文件放在 `public/images_style-examples/` 目录

### Step 2: Supabase 数据库 (生产环境)

1. **上传封面图片** 到 Supabase Storage
2. **插入数据库记录**:

```sql
INSERT INTO styles (id, name, label, description, gradient, cover_image, user_instruction, prompt_template, created_at, updated_at)
VALUES (
  'style_XX',
  'English Name',
  '中文名称',
  '风格描述',
  'from-red-500 to-red-700',
  'https://your-project.supabase.co/storage/v1/object/public/...',
  '上传要求说明',
  '完整的 prompt 模板',
  NOW(),
  NOW()
);
```

### Step 3: 部署 Edge Function (如有修改)

```bash
npx supabase functions deploy get-styles
```

### 排序规则

- **Edge Function**: 按 `created_at` 降序排列（新风格在前）
- **本地数据**: 按数组顺序排列
- 如需调整顺序，修改 Edge Function 的 `.order('created_at', { ascending: false })`

### 文案注意事项

避免在 UI 中使用具体数字，方便后续扩展：

```tsx
// ❌ 不好
<p>我们为你准备了 6 种独特的艺术风格</p>

// ✅ 好
<p>多种独特的艺术风格</p>
```

## Image Processing

- **Upload limit**: 5MB ([App.tsx:72](src/App.tsx#L72))
- **API call**: Base64 image sent directly to Edge Function; Gemini configured with `imageSize: '2K'`, `aspectRatio: '3:4'`

## Security Model

- API keys stored only in Supabase Edge Functions environment
- `prompt_template` never sent to frontend; only parsed `variables[]` array
- Error messages sanitized before returning to client
