/**
 * 图片压缩工具
 * 使用 Canvas API 实现前端图片压缩，无需额外依赖
 */

interface CompressionOptions {
  maxSizeBytes: number;
  initialQuality: number;
  minQuality: number;
  qualityStep: number;
  minDimension: number;
  maxIterations: number;
}

interface CompressionResult {
  base64: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeBytes: 4.5 * 1024 * 1024, // 4.5MB（留 10% 缓冲）
  initialQuality: 0.92,
  minQuality: 0.5,
  qualityStep: 0.1,
  minDimension: 800,
  maxIterations: 5,
};

/**
 * 压缩图片到指定大小以内
 */
export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 如果文件已经小于目标大小，直接返回
  if (file.size <= opts.maxSizeBytes) {
    const base64 = await fileToBase64(file);
    return {
      base64,
      originalSize: file.size,
      compressedSize: file.size,
      wasCompressed: false,
    };
  }

  // 加载图片
  const img = await loadImage(file);
  const originalSize = file.size;

  // 阶段 1: 质量压缩
  let result = await compressByQuality(img, file.type, opts, originalSize);
  if (result.compressedSize <= opts.maxSizeBytes) {
    return result;
  }

  // 阶段 2: 分辨率压缩
  result = await compressByResolution(img, opts, originalSize);
  return result;
}

/**
 * File 转 Base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 加载图片到 Image 对象
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // 释放内存
      resolve(img);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 阶段 1: 通过降低质量压缩图片
 */
async function compressByQuality(
  img: HTMLImageElement,
  mimeType: string,
  opts: CompressionOptions,
  originalSize: number
): Promise<CompressionResult> {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  // 判断是否为透明 PNG
  const hasTransparency = await checkTransparency(img);
  const outputType = hasTransparency ? 'image/png' : 'image/jpeg';

  let quality = opts.initialQuality;
  let result: string;

  do {
    result = canvas.toDataURL(outputType, quality);
    const size = getBase64Size(result);

    if (size <= opts.maxSizeBytes) {
      return {
        base64: result,
        originalSize,
        compressedSize: size,
        wasCompressed: quality < opts.initialQuality,
      };
    }

    quality -= opts.qualityStep;
  } while (quality >= opts.minQuality);

  // 返回最佳尝试结果
  return {
    base64: result,
    originalSize,
    compressedSize: getBase64Size(result),
    wasCompressed: true,
  };
}

/**
 * 阶段 2: 通过降低分辨率压缩图片
 */
async function compressByResolution(
  img: HTMLImageElement,
  opts: CompressionOptions,
  originalSize: number
): Promise<CompressionResult> {
  let scale = 1;
  let iterations = 0;
  let lastResult: string = '';

  while (iterations < opts.maxIterations) {
    scale *= 0.9;
    iterations++;

    const newWidth = Math.max(opts.minDimension, Math.round(img.naturalWidth * scale));
    const newHeight = Math.max(opts.minDimension, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d')!;

    // 高质量缩放
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    lastResult = canvas.toDataURL('image/jpeg', 0.8);
    const size = getBase64Size(lastResult);

    if (size <= opts.maxSizeBytes) {
      return {
        base64: lastResult,
        originalSize,
        compressedSize: size,
        wasCompressed: true,
      };
    }
  }

  // 返回最佳尝试结果
  return {
    base64: lastResult,
    originalSize,
    compressedSize: getBase64Size(lastResult),
    wasCompressed: true,
  };
}

/**
 * 计算 Base64 字符串的字节大小
 */
function getBase64Size(base64: string): number {
  const base64Data = base64.split(',')[1] || '';
  // Base64 编码后大小约为原始数据的 4/3
  return Math.round(base64Data.length * 0.75);
}

/**
 * 检查图片是否有透明通道
 */
async function checkTransparency(img: HTMLImageElement): Promise<boolean> {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 检查 alpha 通道
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        return true;
      }
    }
  } catch {
    // 跨域等情况，假设不透明
    return false;
  }

  return false;
}

/**
 * 格式化字节大小为可读字符串
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
