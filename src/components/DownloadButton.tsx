
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
      className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
    >
      <Download className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      Download Image
    </Button>
  );
};

export default DownloadButton;
