# PhotoLabs 页面修改任务

## 任务目标
修改 PhotoLabs 的页面逻辑，实现以下功能：

## 具体任务

### 1. 修改 View 类型
将 View 类型从：
```tsx
type View = 'home' | 'features' | 'about';
```

修改为：
```tsx
type View = 'home' | 'features' | 'about' | 'upload' | 'workspace';
```

位置：App.tsx 文件顶部，第 58 行左右

### 2. 添加 handleStyleSelect 函数
添加以下函数到 App 组件内部（在现有的函数之前）：

```tsx
const handleStyleSelect = (style: PortraitStyle) => {
  setSelectedStyle(style);
  setCurrentView('upload');
};
```

位置：App.tsx 文件，在 handleFileUpload 函数之前

### 3. 修改首页逻辑
修改首页的渲染逻辑：

**移除以下内容**：
- `{!uploadedImage && (` 条件
- 整个上传区域（Step 2: Upload Area）

**保留以下内容**：
- 主题区域（AI 人像生成工具）
- 标题（选择你的艺术风格）
- 风格卡片网格

**修改风格卡片的点击处理**：
将现有的：
```tsx
onClick={() => setSelectedStyle(style)}
```

修改为：
```tsx
onClick={() => handleStyleSelect(style)}
```

### 4. 添加 upload 视图
在首页视图的后面添加 upload 视图：

**upload 视图内容**：
- 返回按钮：点击后回到首页（currentView 设为 'home'）
- 风格标题：显示选中的风格名称
- 上传区域：显示上传 input
- 上传提示：显示风格要求
- 参数调整：如果风格有参数，显示参数选择区域
- "进入工作区"按钮：点击后跳转到 workspace 视图
- "重新上传"按钮：清除已上传的图片
- 已上传图片预览：显示用户上传的图片

**条件**：
- 只在 `currentView === 'upload'` 且 `selectedStyle` 不为空时显示

### 5. 保持 workspace 视图
workspace 视图保持现有的逻辑不变。

## 实现顺序

1. 修改 View 类型
2. 添加 handleStyleSelect 函数
3. 修改风格卡片点击处理
4. 移除首页的上传区域
5. 添加 upload 视图
6. 测试构建

## 注意事项

1. 确保所有 JSX 语法正确
2. 确保所有引号正确闭合
3. 确保所有条件渲染逻辑正确
4. 每次修改后测试构建
