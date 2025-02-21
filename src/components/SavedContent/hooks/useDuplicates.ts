
import { useMemo } from 'react';
import type { ExtractedContent } from '../types';

export const useDuplicates = (contents: ExtractedContent[]) => {
  const getDuplicateUrls = () => {
    const urlCounts = contents.reduce((acc, content) => {
      acc[content.url] = (acc[content.url] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(urlCounts).filter(url => urlCounts[url] > 1);
  };

  const duplicateColors = [
    'bg-purple-50/50',
    'bg-pink-50/50',
    'bg-blue-50/50',
    'bg-green-50/50',
    'bg-yellow-50/50',
    'bg-orange-50/50',
    'bg-red-50/50',
    'bg-indigo-50/50',
    'bg-cyan-50/50',
    'bg-emerald-50/50'
  ];

  const urlColorMap = useMemo(() => {
    const colorMap = new Map<string, string>();
    let colorIndex = 0;

    const duplicateUrls = getDuplicateUrls();
    duplicateUrls.forEach(url => {
      colorMap.set(url, duplicateColors[colorIndex % duplicateColors.length]);
      colorIndex++;
    });

    return colorMap;
  }, [contents]);

  const isDuplicate = (url: string) => getDuplicateUrls().includes(url);

  return {
    getDuplicateUrls,
    urlColorMap,
    isDuplicate
  };
};
