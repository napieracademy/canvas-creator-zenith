
import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export interface DownloadButtonProps {
  onDownload: () => void;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload, disabled }) => {
  return (
    <Button 
      onClick={onDownload} 
      className="w-full" 
      size="lg"
      disabled={disabled}
    >
      <Download className="mr-2 h-4 w-4" />
      Scarica immagine
    </Button>
  );
};

export default DownloadButton;
