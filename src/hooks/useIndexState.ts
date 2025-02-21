import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { colorPairs } from '@/data/colorPairs';

const DEFAULT_TEXT = 'Social Image Creator';
const DEFAULT_DESCRIPTION = 'Crea bellissime immagini per i social media in pochi secondi. Personalizza colori, font e layout per ottenere il massimo impatto visivo.';

export const useIndexState = () => {
  const location = useLocation();
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[randomIndex];
  };

  const randomTheme = getRandomTheme();

  const loadFromCache = () => {
    if (location.state?.text || location.state?.description) {
      const cached = localStorage.getItem('socialImageCache');
      const cachedData = cached ? JSON.parse(cached) : {};
      
      return {
        text: location.state.text || DEFAULT_TEXT,
        description: location.state.description || DEFAULT_DESCRIPTION,
        backgroundColor: cachedData.backgroundColor || randomTheme.background,
        textColor: cachedData.textColor || randomTheme.text,
        fontSize: cachedData.fontSize || 111,
        descriptionFontSize: cachedData.descriptionFontSize || 56,
        spacing: cachedData.spacing || 100,
        textAlign: cachedData.textAlign || 'left',
        descriptionAlign: cachedData.descriptionAlign || 'left',
        format: cachedData.format || 'post'
      };
    }

    const cached = localStorage.getItem('socialImageCache');
    if (cached) {
      return JSON.parse(cached);
    }

    return {
      text: DEFAULT_TEXT,
      description: DEFAULT_DESCRIPTION,
      backgroundColor: randomTheme.background,
      textColor: randomTheme.text,
      fontSize: 111,
      descriptionFontSize: 56,
      spacing: 100,
      textAlign: 'left',
      descriptionAlign: 'left',
      format: 'post'
    };
  };

  const initialState = loadFromCache();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [text, setText] = useState(initialState.text);
  const [description, setDescription] = useState(initialState.description);
  const [backgroundColor, setBackgroundColor] = useState(initialState.backgroundColor);
  const [textAlign, setTextAlign] = useState(initialState.textAlign);
  const [descriptionAlign, setDescriptionAlign] = useState(initialState.descriptionAlign);
  const [fontSize, setFontSize] = useState(initialState.fontSize);
  const [descriptionFontSize, setDescriptionFontSize] = useState(initialState.descriptionFontSize);
  const [spacing, setSpacing] = useState(initialState.spacing);
  const [effectiveFontSize, setEffectiveFontSize] = useState(initialState.fontSize);
  const [textColor, setTextColor] = useState(initialState.textColor);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState(initialState.format);
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFont, setCurrentFont] = useState('');
  const [credits, setCredits] = useState('');
  const [viewMode, setViewMode] = useState<'full' | 'fast'>('full');
  const [extractedContent, setExtractedContent] = useState('');
  const [logo, setLogo] = useState('/placeholder.svg');
  const [newTextContent, setNewTextContent] = useState('');
  const [newTextAlign, setNewTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [newFontSize, setNewFontSize] = useState(32);
  const [articleContent, setArticleContent] = useState('');
  const [extractedArticleText, setExtractedArticleText] = useState('');
  const [articleTextAlign, setArticleTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [articleFontSize, setArticleFontSize] = useState(32);

  useEffect(() => {
    const dataToCache = {
      text,
      description,
      backgroundColor,
      textColor,
      fontSize,
      descriptionFontSize,
      spacing,
      textAlign,
      descriptionAlign,
      format
    };
    localStorage.setItem('socialImageCache', JSON.stringify(dataToCache));
  }, [text, description, backgroundColor, textColor, fontSize, descriptionFontSize, spacing, textAlign, descriptionAlign, format]);

  useEffect(() => {
    if (location.state?.text || location.state?.description) {
      toast({
        title: "Contenuto importato",
        description: "Il contenuto è stato importato con successo",
      });
    } else {
      toast({
        title: "Tema selezionato",
        description: `Tema: ${randomTheme.name}`,
      });
    }
  }, []);

  useEffect(() => {
    if (extractedContent) {
      setNewTextContent(extractedContent);
      toast({
        title: "Contenuto aggiornato",
        description: "Il contenuto estratto è stato inserito nel nuovo campo",
      });
    }
  }, [extractedContent]);

  useEffect(() => {
    if (articleContent) {
      setExtractedArticleText(articleContent);
      toast({
        title: "Articolo estratto",
        description: "Il contenuto dell'articolo è stato importato correttamente",
      });
    }
  }, [articleContent]);

  return {
    sidebarOpen,
    setSidebarOpen,
    text,
    setText,
    description,
    setDescription,
    backgroundColor,
    setBackgroundColor,
    textAlign,
    setTextAlign,
    descriptionAlign,
    setDescriptionAlign,
    fontSize,
    setFontSize,
    descriptionFontSize,
    setDescriptionFontSize,
    spacing,
    setSpacing,
    effectiveFontSize,
    setEffectiveFontSize,
    textColor,
    setTextColor,
    showSafeZone,
    setShowSafeZone,
    format,
    setFormat,
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    currentFont,
    setCurrentFont,
    credits,
    setCredits,
    viewMode,
    setViewMode,
    extractedContent,
    setExtractedContent,
    logo,
    setLogo,
    newTextContent,
    setNewTextContent,
    newTextAlign,
    setNewTextAlign,
    newFontSize,
    setNewFontSize,
    articleContent,
    setArticleContent,
    extractedArticleText,
    setExtractedArticleText,
    articleTextAlign,
    setArticleTextAlign,
    articleFontSize,
    setArticleFontSize
  };
};
