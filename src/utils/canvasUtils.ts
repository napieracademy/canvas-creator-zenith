
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

export function calculateLines(context: CanvasContext, text: string, size: number, type: 'title' | 'description' = 'title') {
  const { ctx, width, safeZoneMargin, fontFamily = 'Inter' } = context;
  const maxWidth = width - (2 * safeZoneMargin);
  
  ctx.font = `${type === 'title' ? 'bold' : ''} ${size}px ${fontFamily}`;
  const words = text.split(' ');
  const lines: string[] = [];
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
  if (type === 'title') {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
  } else {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
  }
  const areaHeight = fontSize * 2;
  let areaY;
  if (type === 'title') {
    areaY = (height / 2) - (spacing / 2) - areaHeight;
  } else {
    areaY = (height / 2) + (spacing / 2);
  }
  ctx.fillRect(SAFE_ZONE_MARGIN, areaY, width - (2 * SAFE_ZONE_MARGIN), areaHeight);
  ctx.restore();

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
    ctx.fillText(line, x, startY + (index * lineHeight) + (lineHeight / 2));
  });
}

export function drawCredits(
  context: CanvasContext,
  credits: string,
  textAlign: 'left' | 'center' | 'right',
  textColor: string,
  fontSize: number,
  spacing: number = 40
) {
  const { ctx, width, height, fontFamily = 'Inter' } = context;
  
  if (!credits?.trim()) return;

  // Imposta un font size più piccolo per i credits
  const creditsFontSize = Math.min(fontSize * 0.6, 32);
  
  ctx.save();
  
  // Area dei credits (zona in basso)
  const areaHeight = creditsFontSize * 1.5;
  const areaY = height - (SAFE_ZONE_MARGIN + areaHeight);
  
  // Debug area
  ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
  ctx.fillRect(SAFE_ZONE_MARGIN, areaY, width - (2 * SAFE_ZONE_MARGIN), areaHeight);
  
  // Imposta il font e lo stile
  ctx.font = `${creditsFontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';

  // Calcola la posizione X in base all'allineamento
  const x = textAlign === 'left' ? SAFE_ZONE_MARGIN : 
           textAlign === 'right' ? width - SAFE_ZONE_MARGIN : 
           width / 2;

  // Disegna i credits
  const startY = areaY + (areaHeight / 2);
  ctx.fillText(credits, x, startY);
  
  ctx.restore();
}
