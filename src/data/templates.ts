
import { CanvasTemplate } from '@/types/canvas';

export const canvasTemplates: CanvasTemplate[] = [
  {
    name: 'Klaus',
    id: 'klaus',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    fontSize: 72,
    descriptionFontSize: 32,
    textAlign: 'center',
    descriptionAlign: 'center',
    spacing: 40
  },
  {
    name: 'Lucky',
    id: 'lucky',
    backgroundColor: '#FF719A',
    textColor: '#ffffff',
    fontSize: 64,
    descriptionFontSize: 28,
    textAlign: 'left',
    descriptionAlign: 'left',
    spacing: 30
  }
];

export const getTemplate = (id: 'klaus' | 'lucky'): CanvasTemplate => {
  return canvasTemplates.find(template => template.id === id) || canvasTemplates[0];
};
