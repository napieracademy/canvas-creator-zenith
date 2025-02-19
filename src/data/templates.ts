
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
    backgroundColor: '#000000',
    textColor: '#ffffff',
    fontSize: 48,
    descriptionFontSize: 24,
    textAlign: 'left',
    descriptionAlign: 'left',
    spacing: 20
  }
];

export const getTemplate = (id: 'klaus' | 'lucky'): CanvasTemplate => {
  return canvasTemplates.find(template => template.id === id) || canvasTemplates[0];
};
