
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
  
  // Se è un colore solido o un gradiente
  if (!backgroundUrl.startsWith('http') && !backgroundUrl.startsWith('/')) {
    ctx.fillStyle = backgroundUrl;
    ctx.fillRect(0, 0, width, height);
    return Promise.resolve();
  }

  // Se è un'immagine
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let x = 0;
      let y = 0;

      if (aspectRatio > canvasAspectRatio) {
        drawHeight = width / aspectRatio;
        y = (height - drawHeight) / 2;
      } else {
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

export function calculateLines(context: CanvasContext, text: string, size: number): string[] {
  const { ctx, width, safeZoneMargin, fontFamily = 'Inter' } = context;
  
  const maxWidth = width - (2 * safeZoneMargin) - 40; // Aggiungo un margine extra di 40px
  ctx.font = `bold ${size}px ${fontFamily}`;
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
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
  const { ctx, width, height, safeZoneMargin, fontFamily = 'Inter' } = context;
  
  if (!text.trim()) return;

  ctx.save();
  
  const isBold = type === 'title';
  ctx.font = `${isBold ? 'bold' : ''} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';

  const lines = calculateLines(context, text, fontSize);
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = lines.length * lineHeight;
  
  // Calcola la posizione verticale iniziale
  let startY;
  if (type === 'title') {
    // Per il titolo, parti da 1/3 dell'altezza disponibile
    startY = (height / 3) - (totalTextHeight / 2);
  } else {
    // Per la descrizione, parti da 2/3 dell'altezza disponibile
    startY = (height * 2/3) - (totalTextHeight / 2);
  }

  // Assicurati che il testo rimanga dentro i margini di sicurezza
  startY = Math.max(safeZoneMargin + fontSize/2, Math.min(startY, height - safeZoneMargin - totalTextHeight));

  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    const x = textAlign === 'left' ? safeZoneMargin + 20 : 
             textAlign === 'right' ? width - safeZoneMargin - 20 : 
             width / 2;
             
    ctx.fillText(line, x, y);
  });

  ctx.restore();
}
