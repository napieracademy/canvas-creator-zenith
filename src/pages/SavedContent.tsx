
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedContent {
  id: string;
  url: string;
  title: string;
  description: string;
  image_url: string;
  credits: string;
  content: string;
  extraction_date: string;
  created_at: string;
}

const SavedContent = () => {
  const [contents, setContents] = useState<ExtractedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('extracted_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Errore durante il caricamento dei contenuti:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i contenuti salvati",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('extracted_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContents(contents.filter(content => content.id !== id));
      toast({
        title: "Contenuto eliminato",
        description: "Il contenuto è stato eliminato con successo",
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il contenuto",
        variant: "destructive",
      });
    }
  };

  const handleView = (content: ExtractedContent) => {
    navigate('/extracted-content', {
      state: {
        url: content.url,
        title: content.title,
        description: content.description,
        image: content.image_url,
        credits: content.credits,
        content: content.content,
        extractionDate: content.extraction_date,
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Caricamento contenuti...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla home
        </Button>
        <h1 className="text-2xl font-bold">Contenuti Salvati</h1>
      </div>

      {contents.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">Nessun contenuto salvato</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contents.map((content) => (
            <Card key={content.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <h2 className="text-xl font-semibold">{content.title || 'Senza titolo'}</h2>
                  <p className="text-sm text-gray-500 break-all">{content.url}</p>
                  <p className="text-sm">{content.description?.substring(0, 200)}...</p>
                  <p className="text-xs text-gray-400">
                    Estratto il: {new Date(content.extraction_date).toLocaleString('it-IT')}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleView(content)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(content.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedContent;
