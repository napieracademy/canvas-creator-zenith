
import { ColorPresetPair } from "@/types/colorPresets";

export const retroThemes: ColorPresetPair[] = [
  {
    name: "Classic C64",
    background: "#3E31A2",  // Blu C64 classico
    text: "#7ABDC5",       // Ciano chiaro C64
    category: 'retro',
    font: 'font-c64-system'
  },
  {
    name: "Terminal Verde",
    background: "#000000",  // Nero classico
    text: "#5FE36D",       // Verde fosforescente
    category: 'retro',
    font: 'font-c64-mono'
  },
  {
    name: "BASIC Mode",
    background: "#4F46BA", // Blu scuro C64
    text: "#FFFFFF",      // Bianco puro
    category: 'retro',
    font: 'font-c64-bold'
  },
  {
    name: "PETSCII Art",
    background: "#221F26", // Grigio scuro
    text: "#9EF1D9",      // Verde acqua C64
    category: 'retro',
    font: 'font-c64-wide'
  }
];
