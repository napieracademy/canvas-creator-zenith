
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
      className="w-full group hover:bg-primary/90 transition-all duration-200"
    >
      <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      Download Image
    </Button>
  );
};

export default DownloadButton;
