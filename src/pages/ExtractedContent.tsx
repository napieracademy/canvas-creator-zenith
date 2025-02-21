
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const contentData = location.state as ExtractedContentState;

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

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Torna indietro
      </Button>

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
            <h3 className="text-lg font-semibold mb-2">Contenuto (Prime 10 righe)</h3>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
              {contentData.content}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExtractedContent;
