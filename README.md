# PhotoLabs AI - Supabase 后端部署指南

## 项目概述

PhotoLabs AI 已成功迁移到 Supabase 后端架构，将 API 密钥和提示词模板从前端完全移除，提升了安全性。

## 前置步骤

### 1. 创建 Supabase 项目

访问 https://supabase.com 并创建新项目：

1. 点击 "New Project"，命名为 \`photolabs-ai\`
2. 等待项目创建完成（约 2 分钟）
3. 在 Project Settings → API 中获取：
   - **Project URL**：格式如 \`https://xxx.supabase.co\`
   - **Anon Public Key**：\`eyJhbGc...\`
   - **Service Role Key**：用于 Edge Functions（密钥）

### 2. 配置环境变量

在 Supabase Dashboard → Settings → Edge Functions 中添加：

\`\`\`
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### 3. 配置前端环境变量

复制项目根目录的 \`.env.local.example\` 文件为 \`.env.local\`，并填入 Supabase 配置：

\`\`\`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
\`\`\`

### 4. 执行数据库迁移

有两种方式：

**方式 1：通过 Supabase Dashboard**
1. 进入项目 Dashboard
2. 打开 SQL Editor
3. 将 \`supabase/migrations/001_create_styles_table.sql\` 文件内容粘贴进去
4. 点击 "Run"

**方式 2：通过 Supabase CLI**
\`\`\`bash
# 安装 Supabase CLI
npm install -g supabase

# 登录并关联项目
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# 执行迁移
npx supabase db push
\`\`\`

### 5. 部署 Edge Functions

\`\`\`bash
# 部署 get-styles 函数
npx supabase functions deploy get-styles

# 部署 generate-image 函数
npx supabase functions deploy generate-image

# 同时部署多个函数
npx supabase functions deploy get-styles generate-image
\`\`\`

**注意**：首次部署时，系统会自动读取 Edge Functions 中的环境变量（GEMINI_API_KEY）。

## 运行项目

### 开发模式

\`\`\`bash
# 启动前端开发服务器
npm run dev
\`\`\`

前端将运行在 \`http://localhost:3004\`

### 生产构建

\`\`\`bash
# 构建前端静态文件
npm run build

# 构建产物在 \`dist/\` 目录
\`\`\`

## 安全验证

部署后，请在浏览器开发者工具中验证：

1. **验证 API 密钥不泄露**
   - 按 F12 打开开发者工具
   - 在 Sources 标签搜索 \`GEMINI_API_KEY\`
   - 应该找不到任何结果

2. **验证提示词模板不泄露**
   - 搜索完整提示词内容（如 "background color: [blue/green/orange]"）
   - 应该找不到任何结果

3. **验证 Edge Function 响应安全**
   - 在 Network 标签查看 \`/functions/v1/get-styles\` 请求
   - 确认响应不包含 \`prompt_template\` 字段
   - 仅返回 \`variables\` 数组

## 项目结构

\`\`\`
Photo_Labs_gemini/
├── src/                          # 前端源代码
│   ├── App.tsx               # 主应用（已修改）
│   ├── components/             # UI 组件
│   ├── services/               # API 服务层
│   │   ├── supabase.ts       # Supabase 客户端
│   │   └── api.ts            # API 调用封装
│   ├── types/                 # 类型定义
│   └── utils/                # 工具函数
├── supabase/                    # Edge Functions
│   ├── functions/
│   │   ├── _shared/
│   │   │   └── types.ts       # 共享类型
│   │   ├── get-styles/
│   │   │   └── index.ts       # 获取风格列表
│   │   └── generate-image/
│   │       ├── index.ts         # 生成图片
│   │       └── utils.ts       # 工具函数
│   └── migrations/
│       └── 001_create_styles_table.sql  # 数据库迁移
├── dist/                       # 构建产物
├── .env.local.example            # 环境变量模板
├── vite.config.ts              # Vite 配置（已修改）
└── package.json
\`\`\`

## 关键改进

1. **安全性提升**
   - API 密钥存储在 Supabase Edge Functions 环境变量
   - 提示词模板存储在 Supabase 数据库
   - 前端不再访问任何敏感信息

2. **架构优化**
   - 使用 Supabase 平台提供的 PostgreSQL 数据库
   - Edge Functions 提供无服务器计算能力
   - 自动扩展和负载均衡

3. **代码组织**
   - 清晰的前后端分离
   - 类型安全的数据访问
   - 模块化的 Edge Functions

## 后续扩展

在第二阶段，可以考虑：

1. **用户认证**
   - 使用 Supabase Auth 添加用户登录
   - 实现用户配额管理

2. **生成历史**
   - 创建 \`generations\` 表记录每次生成
   - 支持查看历史和重新生成

3. **图片存储**
   - 使用 Supabase Storage 存储生成的图片
   - 生成可分享的公开 URL

4. **性能优化**
   - 添加 Redis 缓存
   - 实现风格列表缓存

## 故障排查

### 问题：Edge Function 调用失败

**症状**：前端报错 "Failed to fetch styles" 或 "Generation failed"

**解决方案**：
1. 检查 Supabase Dashboard → Edge Functions 日志
2. 确认函数已成功部署
3. 验证环境变量 \`GEMINI_API_KEY\` 已配置

### 问题：数据库连接失败

**症状**：Edge Function 报错 "Failed to fetch styles"

**解决方案**：
1. 确认数据库迁移已执行
2. 检查 Supabase Dashboard → Database 中的 \`styles\` 表
3. 验证 \`Service Role Key\` 配置正确

## 技术支持

- Supabase 文档：https://supabase.com/docs
- Supabase Dashboard：https://supabase.com/dashboard
- Gemini AI 文档：https://ai.google.dev/gemini-api/docs
