import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { colorPairs } from '@/data/colorPairs';
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';
import MobileWarning from '@/components/Layout/MobileWarning';
import LoadingOverlay from '@/components/Layout/LoadingOverlay';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';

const IndexPage = () => {
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[randomIndex];
  };

  const randomTheme = getRandomTheme();
  const isMobile = useIsMobile();

  const [text, setText] = useState('Social Image Creator');
  const [description, setDescription] = useState('Crea bellissime immagini per i social media in pochi secondi. Personalizza colori, font e layout per ottenere il massimo impatto visivo.');
  const [backgroundColor, setBackgroundColor] = useState(randomTheme.background);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [descriptionAlign, setDescriptionAlign] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState(111);
  const [descriptionFontSize, setDescriptionFontSize] = useState(56);
  const [spacing, setSpacing] = useState(100);
  const [effectiveFontSize, setEffectiveFontSize] = useState(111);
  const [textColor, setTextColor] = useState(randomTheme.text);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState<'post' | 'story'>('post');
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFont, setCurrentFont] = useState('');
  const [credits, setCredits] = useState('');

  useEffect(() => {
    toast({
      title: "Tema selezionato",
      description: `Tema: ${randomTheme.name}`,
    });
  }, []);

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="flex">
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
      />
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
      <MobileWarning />
    </div>
  );
};

export default IndexPage;
