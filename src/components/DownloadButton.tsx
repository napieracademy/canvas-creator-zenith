
import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload }) => {
  return (
    <Button 
      onClick={onDownload}
      size="icon"
      variant="ghost"
      className="absolute top-3 right-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};

export default DownloadButton;
