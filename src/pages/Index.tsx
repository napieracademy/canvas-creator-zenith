import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import MobileWarning from '@/components/MobileWarning';
import { calculateOptimalSizes } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast"
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IndexPage = () => {
  const [text, setText] = useState('Titolo');
  const [description, setDescription] = useState('Descrizione');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [descriptionAlign, setDescriptionAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontSize, setFontSize] = useState(120);
  const [effectiveFontSize, setEffectiveFontSize] = useState(120);
  const [descriptionFontSize, setDescriptionFontSize] = useState(30);
  const [spacing, setSpacing] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState<'post' | 'story'>('post');
	const [currentFont, setCurrentFont] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('title');
  const [credits, setCredits] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast()

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCredits(localStorage.getItem('credits') === 'true');
    }
  }, []);

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
  };

  const handleMagicOptimization = () => {
    const { titleSize, descriptionSize } = calculateOptimalSizes(text, description);
    setFontSize(titleSize);
    setDescriptionFontSize(descriptionSize);
  };

  const handleDownload = () => {
    toast({
      title: "Download iniziato",
      description: "L'immagine verrà scaricata a breve"
    });
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="flex">
      <div className={`relative transition-all duration-300 ${sidebarOpen ? 'w-[400px]' : 'w-0'}`}>
        {sidebarOpen && (
          <Sidebar
            text={text}
            description={description}
            textAlign={textAlign}
            descriptionAlign={descriptionAlign}
            backgroundColor={backgroundColor}
            textColor={textColor}
            fontSize={fontSize}
            descriptionFontSize={descriptionFontSize}
            spacing={spacing}
            format={format}
            currentFont={currentFont}
            onFormatChange={setFormat}
            onTextChange={setText}
            onDescriptionChange={setDescription}
            onTextAlignChange={setTextAlign}
            onDescriptionAlignChange={setDescriptionAlign}
            onFontSizeChange={setFontSize}
            onDescriptionFontSizeChange={setDescriptionFontSize}
            onSpacingChange={setSpacing}
            disabled={isLoading}
            onTitleExtracted={setText}
            onDescriptionExtracted={setDescription}
            onTabChange={setActiveTab}
            onLoadingChange={setIsLoading}
            onColorSelect={handleColorSelect}
            onFontChange={setCurrentFont}
          />
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white border rounded-r-lg p-1 hover:bg-gray-50"
        >
          {sidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>
      <MainContent
        text={text}
        description={description}
        backgroundColor={backgroundColor}
        textAlign={textAlign}
        descriptionAlign={descriptionAlign}
        textColor={textColor}
        fontSize={fontSize}
        descriptionFontSize={descriptionFontSize}
        spacing={spacing}
        showSafeZone={showSafeZone}
        format={format}
        currentFont={currentFont}
        isLoading={isLoading}
        credits={credits}
        onEffectiveFontSizeChange={setEffectiveFontSize}
        onShowSafeZoneChange={setShowSafeZone}
        onSpacingChange={setSpacing}
        onMagicOptimization={handleMagicOptimization}
        onDownload={handleDownload}
        onTextChange={setText}
        onDescriptionChange={setDescription}
        onTitleExtracted={setText}
        onDescriptionExtracted={setDescription}
        onTabChange={setActiveTab}
        onLoadingChange={setIsLoading}
      />
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
    </div>
  );
};

export default IndexPage;
