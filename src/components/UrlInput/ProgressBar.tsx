
import React from 'react';
import { Progress } from '../ui/progress';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="space-y-1">
      <Progress value={value} className="h-2" />
      <p className="text-sm text-gray-500 text-right">{value}%</p>
    </div>
  );
};

export default ProgressBar;
