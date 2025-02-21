import { CanvasContext } from '@/types/canvas';

export const SAFE_ZONE_MARGIN = 120;
const LOGO_SIZE = 80;
const LOGO_MARGIN = 40;

export function drawSafeZone(ctx: CanvasRenderingContext2D, width: number, height: number) {
  console.log('Drawing safe zone:', { width, height });
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

export function drawLogo(context: CanvasContext, logoUrl: string) {
  const { ctx, width, height } = context;
  
  console.log('🖼️ Attempting to draw logo:', { logoUrl, width, height });
  
  // Se l'URL non è valido o è il placeholder, non fare nulla
  if (!logoUrl || logoUrl === '/placeholder.svg') {
    console.log('⚠️ Logo URL non valido o placeholder:', logoUrl);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log('✅ Logo loaded successfully:', { 
        originalWidth: img.width, 
        originalHeight: img.height
      });
      
      try {
        // Salva il contesto corrente
        ctx.save();
        
        // Calcola le dimensioni per mantenere l'aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = width;
        let drawHeight = height * 0.5; // Usa metà dell'altezza del canvas
        
        if (aspectRatio > 1) {
          // Immagine più larga che alta
          drawHeight = drawWidth / aspectRatio;
        } else {
          // Immagine più alta che larga
          drawWidth = drawHeight * aspectRatio;
        }
        
        // Centra l'immagine
        const x = (width - drawWidth) / 2;
        const y = 0;
        
        console.log('🎨 Drawing logo with dimensions:', { 
          x, y, width: drawWidth, height: drawHeight
        });

        // Imposta compositing mode
        ctx.globalCompositeOperation = 'source-over';
        
        // Disegna l'immagine
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        // Ripristina il contesto
        ctx.restore();
        
        console.log('✨ Logo drawing completed');
        resolve(true);
      } catch (error) {
        console.error('❌ Error while drawing logo:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('❌ Error loading logo:', error);
      reject(error);
    };
    
    console.log('🔄 Starting logo load:', logoUrl);
    img.src = logoUrl;
  });
}

export function calculateLines(context: CanvasContext, text: string, size: number, type: 'title' | 'description' = 'title') {
  const { ctx, width, safeZoneMargin, fontFamily = 'Inter' } = context;
  console.log('Calculating lines:', { text, size, type, fontFamily });
  
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
  
  console.log('Calculated lines:', lines);
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
  console.log('Drawing text:', { text, textAlign, textColor, fontSize, type, spacing });
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
      console.log('Drawing line:', { line, x, y });
      ctx.fillText(line, x, y);
    });
  } catch (error) {
    console.error('Error drawing text:', error);
  } finally {
    ctx.restore();
  }
}
