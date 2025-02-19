
import { CanvasContext } from '@/types/canvas';

export const SAFE_ZONE_MARGIN = 120;

export function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

export function drawSafeZone(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Overlay semi-trasparente fuori dalla safe zone
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

export function calculateLines(context: CanvasContext, text: string, size: number) {
  const { ctx, width, safeZoneMargin } = context;
  const maxWidth = width - (2 * safeZoneMargin);
  
  ctx.font = `${size}px Inter`;
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

export function textFitsInSafeZone(context: CanvasContext, text: string, size: number) {
  const { height, safeZoneMargin } = context;
  const maxHeight = height - (2 * safeZoneMargin);
  
  const lines = calculateLines(context, text, size);
  const totalHeight = lines.length * (size * 1.2);
  
  return totalHeight <= maxHeight && lines.every(line => {
    const metrics = context.ctx.measureText(line);
    return metrics.width <= (context.width - (2 * safeZoneMargin));
  });
}

export function drawText(
  context: CanvasContext,
  text: string,
  textAlign: 'left' | 'center' | 'right',
  textColor: string,
  fontSize: number,
  type: 'title' | 'description' = 'title'
) {
  const { ctx, width, height } = context;
  
  if (!text.trim()) {
    if (type === 'title') {
      ctx.font = '32px Inter';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Inserisci il tuo testo...', width / 2, height / 2);
    }
    return;
  }

  ctx.font = `${fontSize}px Inter`;
  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';
  ctx.setLineDash([]);

  const lines = calculateLines(context, text, fontSize);
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  
  // Calcola la posizione verticale in base al tipo di testo
  let startY;
  if (type === 'title') {
    startY = (height / 2) - totalHeight; // Posiziona il titolo più in alto
  } else {
    startY = (height / 2) + (fontSize * 0.5); // Mantiene la descrizione sotto con un margine fisso
  }

  const x = textAlign === 'left' ? SAFE_ZONE_MARGIN : 
           textAlign === 'right' ? width - SAFE_ZONE_MARGIN : 
           width / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + (index * lineHeight) + (lineHeight / 2));
  });
}
