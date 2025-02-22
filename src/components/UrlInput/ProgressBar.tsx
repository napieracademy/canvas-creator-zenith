
import React from 'react';
import { Progress } from '../ui/progress';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="space-y-1">
    <Progress value={progress} className="h-2" />
    <p className="text-sm text-gray-500 text-right">{progress}%</p>
  </div>
);
