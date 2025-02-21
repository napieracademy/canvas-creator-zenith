
import { CanvasContext } from '@/types/canvas';

export const SAFE_ZONE_MARGIN = 120;

export function drawSafeZone(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, SAFE_ZONE_MARGIN);
  ctx.fillRect(0, height - SAFE_ZONE_MARGIN, width, SAFE_ZONE_MARGIN);
  ctx.fillRect(0, SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, height - (2 * SAFE_ZONE_MARGIN));
  ctx.fillRect(width - SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, height - (2 * SAFE_ZONE_MARGIN));
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(
    SAFE_ZONE_MARGIN, 
    SAFE_ZONE_MARGIN, 
    width - (2 * SAFE_ZONE_MARGIN), 
    height - (2 * SAFE_ZONE_MARGIN)
  );
}

export function drawBackground(context: CanvasContext, backgroundUrl: string): Promise<void> {
  const { ctx, width, height } = context;
  
  console.log('Drawing background:', { backgroundUrl, width, height });
  
  // Se è un colore solido o un gradiente
  if (!backgroundUrl.startsWith('http') && !backgroundUrl.startsWith('/')) {
    if (backgroundUrl.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const colors = backgroundUrl.match(/#[a-fA-F0-9]{6}/g);
      if (colors && colors.length >= 2) {
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
      }
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = backgroundUrl;
    }
    ctx.fillRect(0, 0, width, height);
    return Promise.resolve();
  }

  // Se è un'immagine
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log('Background image loaded:', { 
        originalWidth: img.width, 
        originalHeight: img.height 
      });
      
      const aspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let x = 0;
      let y = 0;

      if (aspectRatio > canvasAspectRatio) {
        // Immagine più larga del canvas
        drawHeight = width / aspectRatio;
        y = (height - drawHeight) / 2;
      } else {
        // Immagine più alta del canvas
        drawWidth = height * aspectRatio;
        x = (width - drawWidth) / 2;
      }

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      resolve();
    };
    
    img.onerror = (error) => {
      console.error('Error loading background image:', error);
      reject(error);
    };
    
    img.src = backgroundUrl;
  });
}

export function calculateLines(context: CanvasContext, text: string, size: number, type: 'title' | 'description' = 'title') {
  const { ctx, width, safeZoneMargin, fontFamily = 'Inter' } = context;
  
  const maxWidth = width - (2 * safeZoneMargin);
  ctx.font = `${type === 'title' ? 'bold' : ''} ${size}px ${fontFamily}`;
  
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  
  return lines;
}

export function drawText(
  context: CanvasContext,
  text: string,
  textAlign: 'left' | 'center' | 'right',
  textColor: string,
  fontSize: number,
  type: 'title' | 'description' = 'title',
  spacing: number = 40
) {
  const { ctx, width, height, fontFamily = 'Inter' } = context;
  
  if (!text.trim()) {
    if (type === 'title') {
      ctx.font = `bold 32px ${fontFamily}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Inserisci il tuo testo...', width / 2, height / 2);
    }
    return;
  }

  ctx.save();
  try {
    ctx.font = `${type === 'title' ? 'bold' : ''} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';
    ctx.setLineDash([]);

    const lines = calculateLines(context, text, fontSize, type);
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    
    let startY;
    if (type === 'title') {
      startY = (height / 2) - (spacing / 2) - totalHeight;
    } else {
      startY = (height / 2) + (spacing / 2);
    }

    const x = textAlign === 'left' ? SAFE_ZONE_MARGIN : 
             textAlign === 'right' ? width - SAFE_ZONE_MARGIN : 
             width / 2;

    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight) + (lineHeight / 2);
      ctx.fillText(line, x, y);
    });
  } finally {
    ctx.restore();
  }
}
