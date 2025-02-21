
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
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
        <div className="text-center text-gray-500 p-8">
          Nessun contenuto salvato
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Titolo</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead className="hidden lg:table-cell">Contenuto</TableHead>
                <TableHead className="hidden lg:table-cell">Data</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((content) => (
                <React.Fragment key={content.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleRow(content.id)}>
                    <TableCell className="w-[30px]">
                      {expandedRows.has(content.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {content.title || 'Senza titolo'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {content.url}
                      </a>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {content.content?.substring(0, 100)}
                      {content.content?.length > 100 ? '...' : ''}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(content.extraction_date).toLocaleString('it-IT')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(content.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/50 p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Descrizione</h3>
                            <p className="text-sm text-muted-foreground">
                              {content.description || 'Nessuna descrizione disponibile'}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Contenuto Completo</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {content.content || 'Nessun contenuto disponibile'}
                            </p>
                          </div>
                          {content.credits && (
                            <div>
                              <h3 className="font-semibold mb-2">Crediti</h3>
                              <p className="text-sm text-muted-foreground">
                                {content.credits}
                              </p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SavedContent;
