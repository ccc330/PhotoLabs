-- 创建 styles 表
CREATE TABLE public.styles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  gradient TEXT NOT NULL,
  cover_image TEXT,
  user_instruction TEXT NOT NULL,
  prompt_template TEXT NOT NULL,  -- 敏感字段，仅后端可访问
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_styles_id ON public.styles(id);
CREATE INDEX idx_styles_name ON public.styles(name);

-- 插入 6 种风格数据
INSERT INTO public.styles (id, name, label, description, gradient, cover_image, user_instruction, prompt_template) VALUES
('style_01',
 'Hand-Drawn Collage',
 '手绘拼贴艺术',
 '黑白胶片质感结合手绘剪贴元素，打造独特的设计感海报风格。',
 'from-orange-400 to-red-500',
 '/images_style-examples/style-examples_1.jpeg',
 '请上传一张半身或大头照，主体清晰。',
 'Use the uploaded portrait as the main subject.

Convert the portrait to **black and white**, with soft contrast and visible film grain.

Cut out the subject from the background using a **rough, imperfect collage-style edge**:

- edges should look torn, ripped, or hand-cut
- no clean masking, no smooth outline
- organic, irregular borders like paper collage

Place the cut-out subject centered on a **solid background color**:

- background color: [blue/green/orange]

Add a **hand-drawn icon** on top of the portrait:

- icon shape: [heart/star]
- icon style: sketchy, imperfect, drawn by hand
- icon color: [blue/green/orange]
- icon should feel flat, graphic, and slightly rough

Overall style:

- editorial collage
- analog, minimal, expressive
- no explanation, no extra elements

Do NOT add text.
Do NOT add digital or futuristic effects.
Keep it simple and artistic.'
),

('style_02',
 'Cinematic Narrative',
 '电影叙事三连拍',
 '充满情感的电影镜头语言，通过三段式构图讲述光影与风的故事。',
 'from-sky-300 to-indigo-400',
 '/images_style-examples/style-examples_2.jpeg',
 '建议上传半身或全身照，展示人物姿态。',
 'Using the attached photo as a facial reference, preserve the person''s facial identity accurately and consistently.

Create a cinematic composition divided into three horizontal frames stacked vertically. Each frame shows the same person in a different pose and moment, interacting with wind and space.

The background across all frames is an open sky with dramatic clouds. Movement increases from top to bottom, creating a visual narrative. Soft cinematic light, film still feeling, natural colors, poetic and emotional tone.'
),

('style_03',
 'Urban Neon Portrait',
 '城市霓虹夜景',
 '赛博朋克风格的都市夜景，迷离的霓虹光影映衬出人物的神秘感。',
 'from-purple-600 to-blue-600',
 '/images_style-examples/style-examples_3.jpeg',
 '适合上传面部清晰的肖像照。',
 'Using the attached photo as a facial reference, preserve the person''s facial identity accurately and consistently.

Create a nighttime portrait illuminated by off-frame neon lights. Soft colored light spills across the face, creating gradients and reflections on the skin.

The background is dark and urban, with a cinematic, late-night mood. Shallow depth of field, subtle grain, moody atmosphere.'
),

('style_04',
 'Slow Shutter Candid',
 '胶片慢门抓拍',
 '模拟复古相机的慢门效果，充满动态模糊与情绪感的瞬间捕捉。',
 'from-zinc-400 to-stone-600',
 '/images_style-examples/style-examples_4.jpeg',
 '适合任何清晰的人像照片。',
 'Using the attached photo as a facial reference, preserve the person''s facial identity accurately and consistently.

Create an analog-style portrait with intentional motion blur, as if the camera moved slightly during exposure. The face remains recognizable but soft, with streaks of light and blurred edges. Film grain, imperfect focus, emotional and nostalgic feeling.'
),

('style_05',
 'Silhouette Shadow',
 '极简光影剪影',
 '利用强烈的单一光源创造戏剧性的投影，极简而富有张力。',
 'from-amber-200 to-orange-100',
 '/images_style-examples/style-examples_5.jpeg',
 '建议上传轮廓清晰的侧面或正面照。',
 'Using the attached photo as a facial reference, preserve the person''s facial identity accurately and consistently.

Create a portrait where the main visual focus is not only the face, but also the shadow the person casts on a wall behind them.

The shadow is large, slightly distorted, and expressive, while the person remains softly lit in the foreground. Minimal environment, strong directional light, poetic and symbolic composition, calm but emotionally loaded.'
),

('style_06',
 'Cold Architecture',
 '冷调建筑美学',
 '置身于宏大的现代主义建筑中，冷峻的色调展现理性的几何美感。',
 'from-slate-300 to-slate-500',
 '/images_style-examples/style-examples_6.jpeg',
 '适合半身或全身照，突出人物与环境的关系。',
 'Using the attached photo as a facial reference, preserve the person''s facial identity accurately and consistently.

Place the subject inside a cold, modern architectural space with clean lines, concrete, or glass. The person appears small within the structure, emphasizing scale and geometry.

Cool color palette, controlled light, contemporary art photography style.'
);

-- 启用 RLS（可选，后续启用）
-- ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
