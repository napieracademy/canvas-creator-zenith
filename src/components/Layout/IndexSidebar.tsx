
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import TextInput from '@/components/TextInput';

interface IndexSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  state: any;
  handlers: any;
}

const IndexSidebar: React.FC<IndexSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  state,
  handlers
}) => {
  return (
    <div className={`relative transition-all duration-300 ${sidebarOpen ? 'w-[400px]' : 'w-0'}`}>
      {sidebarOpen && (
        <>
          <Sidebar
            text={state.text}
            description={state.description}
            textAlign={state.textAlign}
            descriptionAlign={state.descriptionAlign}
            backgroundColor={state.backgroundColor}
            textColor={state.textColor}
            fontSize={state.fontSize}
            descriptionFontSize={state.descriptionFontSize}
            spacing={state.spacing}
            format={state.format}
            currentFont={state.currentFont}
            onFormatChange={state.setFormat}
            onTextChange={state.setText}
            onDescriptionChange={state.setDescription}
            onTextAlignChange={state.setTextAlign}
            onDescriptionAlignChange={state.setDescriptionAlign}
            onFontSizeChange={state.setFontSize}
            onDescriptionFontSizeChange={state.setDescriptionFontSize}
            onSpacingChange={state.setSpacing}
            disabled={state.isLoading}
            onTitleExtracted={state.setText}
            onDescriptionExtracted={handlers.handleDescriptionExtracted}
            onImageExtracted={handlers.handleImageExtracted}
            onTabChange={state.setActiveTab}
            onLoadingChange={state.setIsLoading}
            onColorSelect={handlers.handleColorSelect}
            extractedContent={state.extractedContent}
            onContentExtracted={state.setExtractedContent}
            onLogoChange={handlers.handleLogoChange}
          />
          <TextInput
            value={state.newTextContent}
            onChange={state.setNewTextContent}
            textAlign={state.newTextAlign}
            onTextAlignChange={state.setNewTextAlign}
            fontSize={state.newFontSize}
            onFontSizeChange={state.setNewFontSize}
            label="Contenuto Estratto"
            extractedContent={state.extractedContent}
          />
        </>
      )}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white border rounded-r-lg p-1 hover:bg-gray-50"
      >
        {sidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default IndexSidebar;
