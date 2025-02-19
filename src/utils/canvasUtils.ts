import { CanvasContext } from '@/types/canvas';

export const SAFE_ZONE_MARGIN = 120;

// Precarica i font per il template Lucky
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Josefin+Sans:wght@400;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

export function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  if (color.startsWith('url(')) {
    const img = new Image();
    img.onload = () => {
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    img.src = color.slice(4, -1);
  } else if (color.includes('gradient')) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const colors = color.match(/#[a-fA-F0-9]{6}/g);
    if (colors && colors.length >= 2) {
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
}

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

export function textFitsInSafeZone(context: CanvasContext, text: string, size: number, type: 'title' | 'description' = 'title') {
  const { height, safeZoneMargin } = context;
  const maxHeight = height - (2 * safeZoneMargin);
  
  const lines = calculateLines(context, text, size, type);
  const totalHeight = lines.length * (size * 1.2);
  
  return totalHeight <= maxHeight && lines.every(line => {
    const metrics = context.ctx.measureText(line);
    return metrics.width <= (context.width - (2 * safeZoneMargin));
  });
}

export function calculateLines(context: CanvasContext, text: string, size: number, type: 'title' | 'description' = 'title') {
  const { ctx, width, safeZoneMargin } = context;
  const maxWidth = width - (2 * safeZoneMargin);
  
  ctx.font = `${getFontStyle(type, size)}`;
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

function getFontStyle(type: 'title' | 'description', fontSize: number, template: 'klaus' | 'lucky' = 'klaus'): string {
  if (template === 'lucky') {
    return type === 'title' 
      ? `${fontSize}px 'Bebas Neue'` 
      : `${fontSize}px 'Josefin Sans'`;
  }
  return `${type === 'title' ? 'bold' : ''} ${fontSize}px Inter`;
}

export function drawText(
  context: CanvasContext,
  text: string,
  textAlign: 'left' | 'center' | 'right',
  textColor: string,
  fontSize: number,
  type: 'title' | 'description' = 'title',
  spacing: number = 40,
  template: 'klaus' | 'lucky' = 'klaus'
) {
  const { ctx, width, height, safeZoneMargin } = context;
  
  if (!text.trim()) {
    if (type === 'title') {
      ctx.font = getFontStyle('title', 32, template);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Inserisci il tuo testo...', width / 2, height / 2);
    }
    return;
  }

  ctx.font = getFontStyle(type, fontSize, template);
  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';
  ctx.setLineDash([]);

  const currentLines = calculateLines(context, text, fontSize, type);
  const lineHeight = fontSize * 1.2;
  const currentTextHeight = currentLines.length * lineHeight;
  
  let startY;
  let effectiveSpacing = spacing;

  if (template === 'lucky') {
    // Calcola l'area disponibile dopo l'immagine con margini di sicurezza
    const imageHeight = height * 0.4;
    const contentStartY = imageHeight + (safeZoneMargin * 0.75);
    const availableHeight = height - contentStartY - (safeZoneMargin * 1.25);
    
    if (type === 'title') {
      startY = contentStartY;
      
      // Verifica e adatta lo spazio per titolo e descrizione
      const descFont = ctx.font;
      ctx.font = getFontStyle('description', fontSize, template);
      const descLines = calculateLines(context, text, fontSize, 'description');
      const descHeight = descLines.length * lineHeight;
      ctx.font = descFont;
      
      const totalNeededHeight = currentTextHeight + effectiveSpacing + descHeight;
      
      // Se lo spazio totale necessario supera quello disponibile, riduci lo spacing proporzionalmente
      if (totalNeededHeight > availableHeight) {
        const minSpacing = Math.min(effectiveSpacing, 40); // Mantiene lo spacing minimo
        const maxReduction = effectiveSpacing - minSpacing;
        const overflow = totalNeededHeight - availableHeight;
        const reduction = Math.min(maxReduction, overflow);
        effectiveSpacing = Math.max(minSpacing, effectiveSpacing - reduction);
      }
    } else {
      const titleFont = ctx.font;
      ctx.font = getFontStyle('title', fontSize, template);
      const titleLines = calculateLines(context, text, fontSize, 'title');
      const titleHeight = titleLines.length * lineHeight;
      ctx.font = titleFont;
      
      startY = contentStartY + titleHeight + effectiveSpacing;
      
      // Verifica che la descrizione non superi l'area disponibile
      const bottomLimit = height - (safeZoneMargin * 1.25);
      if (startY + currentTextHeight > bottomLimit) {
        const maxStartY = bottomLimit - currentTextHeight;
        const minSpacing = Math.min(effectiveSpacing, 40);
        effectiveSpacing = Math.max(minSpacing, maxStartY - (contentStartY + titleHeight));
        startY = contentStartY + titleHeight + effectiveSpacing;
      }
    }
  } else {
    // Klaus template mantiene il layout centrato con i margini di sicurezza completi
    let totalContentHeight = currentTextHeight;
    
    if (type === 'title' && text.trim()) {
      const descFont = ctx.font;
      ctx.font = getFontStyle('description', fontSize, template);
      const descLines = calculateLines(context, text, fontSize, 'description');
      const descHeight = descLines.length * lineHeight;
      ctx.font = descFont;
      totalContentHeight += effectiveSpacing + descHeight;
    }

    const centerY = height / 2;
    
    if (type === 'title') {
      startY = centerY - (totalContentHeight / 2);
    } else {
      startY = centerY + (totalContentHeight / 2) - currentTextHeight;
    }

    // Per Klaus, manteniamo i controlli completi della safe zone
    const bottomMargin = height - safeZoneMargin;
    if (startY + currentTextHeight > bottomMargin) {
      startY = bottomMargin - currentTextHeight;
    }
    if (startY < safeZoneMargin) {
      startY = safeZoneMargin;
    }
  }

  const x = textAlign === 'left' ? safeZoneMargin : 
           textAlign === 'right' ? width - safeZoneMargin : 
           width / 2;

  currentLines.forEach((line, index) => {
    const y = startY + (index * lineHeight) + (lineHeight / 2);
    ctx.fillText(line, x, y);
  });
}
