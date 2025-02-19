
export interface CanvasProps {
  text: string;
  description?: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign?: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  descriptionFontSize?: number;
  spacing?: number;
  onEffectiveFontSizeChange?: (size: number) => void;
  showSafeZone?: boolean;
  format?: 'post' | 'story';
  overlay?: string;
  onSpacingChange?: (spacing: number) => void;
  imageUrl?: string | null;
  template?: 'klaus' | 'lucky';
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  safeZoneMargin: number;
}

export interface CanvasTemplate {
  name: string;
  id: 'klaus' | 'lucky';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  descriptionFontSize: number;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  spacing: number;
}
