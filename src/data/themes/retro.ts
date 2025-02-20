
import { ColorPresetPair } from "@/types/colorPresets";

export const retroThemes: ColorPresetPair[] = [
  {
    name: "Classic C64",
    background: "#4040E0",  // Blu C64 più accurato
    text: "#93FFD2",       // Verde chiaro C64 più accurato
    category: 'retro',
    font: 'font-c64-system'  // Press Start 2P
  },
  {
    name: "Terminal Verde",
    background: "#000000",  
    text: "#4CFF4C",       // Verde fosforescente più luminoso
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
    name: "PETSCII Art",
    background: "#2B2B2B", 
    text: "#93FFD2",      
    category: 'retro',
    font: 'font-c64-wide'   
  }
];
