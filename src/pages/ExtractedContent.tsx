
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedContentState {
  url: string;
  title: string;
  description: string;
  image: string;
  credits: string;
  content: string;
  extractionDate: string;
}

const ExtractedContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contentData = location.state as ExtractedContentState;

  useEffect(() => {
    if (contentData?.content) {
      const firstTenLines = contentData.content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 10)
        .join('\n');

      const contentEvent = new CustomEvent('contentExtracted', {
        detail: { content: firstTenLines }
      });
      document.dispatchEvent(contentEvent);
    }
  }, [contentData]);

  const handleSaveToDatabase = async () => {
    try {
      const { error } = await supabase
        .from('extracted_content')
        .insert({
          url: contentData.url,
          title: contentData.title,
          description: contentData.description,
          image_url: contentData.image,
          credits: contentData.credits,
          content: contentData.content,
          extraction_date: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Contenuto salvato",
        description: "Il contenuto è stato salvato nel database",
      });
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio del contenuto",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['URL', 'Titolo', 'Descrizione', 'Immagine', 'Crediti', 'Contenuto', 'Data Estrazione'],
      [
        contentData.url,
        contentData.title,
        contentData.description,
        contentData.image,
        contentData.credits,
        contentData.content,
        contentData.extractionDate
      ]
    ]
    .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = URL.createObjectURL(blob);
    link.download = `extracted_content_${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV esportato",
      description: "Il file CSV è stato scaricato",
    });
  };

  if (!contentData) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna indietro
        </Button>
        <Card className="p-6">
          <p className="text-center text-gray-500">Nessun contenuto da visualizzare</p>
        </Card>
      </div>
    );
  }

  const handleCopyContent = () => {
    const firstTenLines = contentData.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 10)
      .join('\n');

    navigator.clipboard.writeText(firstTenLines);
    toast({
      title: "Contenuto copiato",
      description: "Il contenuto è stato copiato negli appunti",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna indietro
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Esporta CSV
          </Button>
          <Button onClick={handleSaveToDatabase}>
            <Save className="h-4 w-4 mr-2" />
            Salva nel Database
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Contenuto Estratto</h2>
          <p className="text-sm text-gray-500">Estratto il: {contentData.extractionDate}</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">URL Originale</h3>
            <a href={contentData.url} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline break-all">
              {contentData.url}
            </a>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Metadati</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Titolo:</span> {contentData.title}</p>
              <p><span className="font-medium">Descrizione:</span> {contentData.description}</p>
              {contentData.credits && (
                <p><span className="font-medium">Crediti:</span> {contentData.credits}</p>
              )}
              {contentData.image && (
                <div>
                  <p className="font-medium mb-2">Immagine:</p>
                  <img 
                    src={contentData.image} 
                    alt="Immagine estratta"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Contenuto (Prime 10 righe)</h3>
              <Button variant="outline" size="sm" onClick={handleCopyContent}>
                <Copy className="h-4 w-4 mr-2" />
                Copia contenuto
              </Button>
            </div>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
              {contentData.content
                .split('\n')
                .filter(line => line.trim().length > 0)
                .slice(0, 10)
                .join('\n')}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExtractedContent;
