import { PublicPortraitStyle, StyleVariable } from '@/types';

// 解析模板中的变量 [option1/option2/option3]
function parseVariables(template: string): StyleVariable[] {
  const regex = /\[(.*?)\]/g;
  const matches = [...template.matchAll(regex)];

  return matches.map((match, index) => ({
    key: `var_${index}`,
    label: `选项 ${index + 1}`,
    choices: match[1].split('/').map(s => s.trim())
  }));
}

// 原始风格模板数据
const RAW_STYLES = [
  // Style 07: 马年前卫风
  {
    id: 'style_07',
    name: 'Year of the Horse Avant-Garde',
    label: '马年前卫风',
    description: '高对比度前卫时尚肖像，红衣与黑马形成强烈视觉冲击。',
    gradient: 'from-red-500 to-red-700',
    coverImage: '/images_style-examples/style-examples_7.jpg',
    userInstruction: '上半身或全身近照',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Create a high-contrast avant-garde fashion portrait featuring the subject and a dark horse.

Subject & Styling:
The character wears loose, modern Chinese minimalist red clothing.
- Accessories: Red-framed geometric sunglasses.
- Expression: Calm, neutral, and powerful.

Composition & Interaction:
A dark brown or black horse stands behind the model.
The horse's head rests intimately on the model's shoulder or near their head.
The dark color of the horse provides a striking contrast to the red surroundings.

Environment:
- Solid pure red background: The model's clothing should visually blend into the background, creating a flat, graphic effect.
- Monochromatic palette: Dominant red tones with black accents.
- Style: Minimalist, editorial, artistic photography.

Do NOT add patterns or complex textures to the background.`
  },
  // Style 08: 马年剪纸风
  {
    id: 'style_08',
    name: 'Year of the Horse Paper-Cut',
    label: '马年剪纸风',
    description: '马年主题高级时尚肖像，传统剪纸艺术与现代摄影的融合。',
    gradient: 'from-red-400 to-rose-600',
    coverImage: '/images_style-examples/style-examples_8.jpg',
    userInstruction: '半身或全身近照',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Create a high-fashion editorial portrait with a "Year of the Horse" theme. The composition should be artistic, noble, and culturally rich.

Subject & Attire:
- The subject matching the attached photo, with a calm, elegant expression, looking at the camera.
- The main character is dressed in a bespoke scarlet gown, crafted from high-end fabric.
- A luxurious beige and red shawl featuring a distinct monogram pattern (visible 'Ch' motifs) is draped over her left shoulder and arm. He gently grasps the edge of the shawl with her left hand.
- Accessories include gold earrings.

Scene Composition:
- Foreground (Left): A giant red paper-cut style floral installation stands upright, featuring traditional hollow-out art details.
- Background: A deep red textured wall. Projected onto this wall is a soft, diffused shadow of a horse's head and neck.

Atmosphere & Technicals:
- Color Palette: Monochromatic red theme (Scarlet, Deep Maroon) with Beige and faded Grey/Black for the shadow.
- Lighting: Soft, cinematic lighting on the subject; the background projection is dim and atmospheric.
- Mood: Artistic, noble, cultural, and avant-garde.

Do NOT generate a real horse; the background must be a shadow/silhouette.
Do NOT distort the facial features.`
  },
  {
    id: 'style_01',
    name: 'Hand-Drawn Collage',
    label: '手绘拼贴艺术',
    description: '黑白胶片质感结合手绘剪贴元素，打造独特的设计感海报风格。',
    gradient: 'from-orange-400 to-red-500',
    userInstruction: '请上传一张半身或大头照，主体清晰。',
    promptTemplate: `Use the uploaded portrait as the main subject.

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
Keep it simple and artistic.`
  },
  {
    id: 'style_02',
    name: 'Cinematic Narrative',
    label: '电影叙事三连拍',
    description: '充满情感的电影镜头语言，通过三段式构图讲述光影与风的故事。',
    gradient: 'from-sky-300 to-indigo-400',
    userInstruction: '建议上传半身或全身照，展示人物姿态。',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Create a cinematic composition divided into three horizontal frames stacked vertically. Each frame shows the same person in a different pose and moment, interacting with the wind and space.

The background across all frames is an open sky with dramatic clouds. Movement increases from top to bottom, creating a visual narrative. Soft cinematic light, film still feeling, natural colors, poetic and emotional tone.`
  },
  {
    id: 'style_03',
    name: 'Urban Neon Portrait',
    label: '城市霓虹夜景',
    description: '赛博朋克风格的都市夜景，迷离的霓虹光影映衬出人物的神秘感。',
    gradient: 'from-purple-600 to-blue-600',
    userInstruction: '适合上传面部清晰的肖像照。',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Create a nighttime portrait illuminated by off-frame neon lights. Soft colored light spills across the face, creating gradients and reflections on the skin.

The background is dark and urban, with a cinematic, late-night mood. Shallow depth of field, subtle grain, moody atmosphere.`
  },
  {
    id: 'style_04',
    name: 'Slow Shutter Candid',
    label: '胶片慢门抓拍',
    description: '模拟复古相机的慢门效果，充满动态模糊与情绪感的瞬间捕捉。',
    gradient: 'from-zinc-400 to-stone-600',
    userInstruction: '适合任何清晰的人像照片。',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Create an analog-style portrait with intentional motion blur, as if the camera moved slightly during exposure. The face remains recognizable but soft, with streaks of light and blurred edges. Film grain, imperfect focus, emotional and nostalgic feeling.`
  },
  {
    id: 'style_05',
    name: 'Silhouette Shadow',
    label: '极简光影剪影',
    description: '利用强烈的单一光源创造戏剧性的投影，极简而富有张力。',
    gradient: 'from-amber-200 to-orange-100',
    userInstruction: '建议上传轮廓清晰的侧面或正面照。',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Create a portrait where the main visual focus is not only the face, but the shadow the person casts on a wall behind them.

The shadow is large, slightly distorted, and expressive, while the person remains softly lit in the foreground. Minimal environment, strong directional light, poetic and symbolic composition, calm but emotionally loaded.`
  },
  {
    id: 'style_06',
    name: 'Cold Architecture',
    label: '冷调建筑美学',
    description: '置身于宏大的现代主义建筑中，冷峻的色调展现理性的几何美感。',
    gradient: 'from-slate-300 to-slate-500',
    userInstruction: '适合半身或全身照，突出人物与环境的关系。',
    promptTemplate: `Using the attached photo as a facial reference, preserve the person's facial identity accurately and consistently.

Place the subject inside a cold, modern architectural space with clean lines, concrete, or glass. The person appears small within the structure, emphasizing scale and geometry.

Cool color palette, controlled light, contemporary art photography style.`
  }
];

// 转换为 PublicPortraitStyle 格式（包含解析后的 variables）
export const PORTRAIT_STYLES: PublicPortraitStyle[] = RAW_STYLES.map(style => ({
  id: style.id,
  name: style.name,
  label: style.label,
  description: style.description,
  gradient: style.gradient,
  coverImage: style.coverImage,
  userInstruction: style.userInstruction,
  variables: parseVariables(style.promptTemplate)
}));

// 导出原始模板（供 generate-image Edge Function 使用）
export const STYLE_TEMPLATES = RAW_STYLES.reduce((acc, style) => {
  acc[style.id] = style.promptTemplate;
  return acc;
}, {} as Record<string, string>);
