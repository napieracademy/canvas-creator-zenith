
import { ColorPresetPair } from "@/types/colorPresets";

export const retroThemes: ColorPresetPair[] = [
  {
    name: "Classic C64",
    background: "#4040E0",
    text: "#93FFD2",
    category: 'retro',
    font: 'font-c64-system'
  },
  {
    name: "Terminal Verde",
    background: "#000000",
    text: "#4CFF4C",
    category: 'retro',
    font: 'font-c64-mono'
  },
  {
    name: "BASIC Mode",
    background: "#4040E0",
    text: "#FFFFFF",
    category: 'retro',
    font: 'font-c64-bold'
  },
  {
    name: "PETSCII Grid",
    background: "#4040E0",
    text: "#93FFD2",
    category: 'retro',
    font: 'font-c64-wide',
    pattern: {
      type: 'grid',
      color1: '#4040E0',
      color2: '#93FFD2',
      size: 8
    }
  },
  {
    name: "PETSCII Dots",
    background: "#000000",
    text: "#93FFD2",
    category: 'retro',
    font: 'font-c64-wide',
    pattern: {
      type: 'dots',
      color1: '#000000',
      color2: '#93FFD2',
      size: 4
    }
  },
  {
    name: "PETSCII Stripes",
    background: "#4040E0",
    text: "#FFFFFF",
    category: 'retro',
    font: 'font-c64-system',
    pattern: {
      type: 'stripes',
      color1: '#4040E0',
      color2: '#93FFD2',
      size: 8
    }
  },
  {
    name: "PETSCII Chess",
    background: "#000000",
    text: "#FFFFFF",
    category: 'retro',
    font: 'font-c64-mono',
    pattern: {
      type: 'checkerboard',
      color1: '#000000',
      color2: '#4040E0',
      size: 16
    }
  }
];
