
import React from 'react';
import UrlFetchControl from '@/components/TextControls/UrlFetchControl';
import SuperButton from '@/components/SuperButton';
import DownloadButton from '@/components/DownloadButton';

interface ImportControlsProps {
  text: string;
  description: string;
  isLoading: boolean;
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onExtractedContentUpdated?: (extractedContent: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onMagicOptimization: () => void;
  onDownload: () => void;
}

const ImportControls: React.FC<ImportControlsProps> = ({
  text,
  description,
  isLoading,
  onTitleExtracted,
  onDescriptionExtracted,
  onImageExtracted,
  onExtractedContentUpdated,
  onTabChange,
  onLoadingChange,
  onTextChange,
  onDescriptionChange,
  onMagicOptimization,
  onDownload
}) => {
  return (
    <div className="flex items-center gap-2">
      <UrlFetchControl
        onTitleExtracted={onTitleExtracted}
        onDescriptionExtracted={onDescriptionExtracted}
        onImageExtracted={onImageExtracted}
        onExtractedContentUpdated={onExtractedContentUpdated}
        onTabChange={onTabChange}
        onLoadingChange={onLoadingChange}
        disabled={isLoading}
      />
      <SuperButton 
        text={text}
        description={description}
        onTextChange={onTextChange}
        onDescriptionChange={onDescriptionChange}
        onMagicOptimization={onMagicOptimization}
        disabled={isLoading}
      />
      <DownloadButton onDownload={onDownload} />
    </div>
  );
};

export default ImportControls;
