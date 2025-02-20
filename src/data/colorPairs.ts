
import { ColorPresetPair } from "@/types/colorPresets";
import { classicThemes } from "./themes/classic";
import { cosmicThemes } from "./themes/cosmic";
import { retroThemes } from "./themes/retro";

export const colorPairs: ColorPresetPair[] = [
  ...classicThemes,
  ...cosmicThemes,
  ...retroThemes
];
