
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/SavedContent/Header';
import { LoadingState } from '@/components/SavedContent/LoadingState';
import { EmptyState } from '@/components/SavedContent/EmptyState';
import { ContentTable } from '@/components/SavedContent/ContentTable';
import type { ExtractedContent } from '@/components/SavedContent/types';

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

      // Aggiorna la lista dopo l'eliminazione
      await fetchContents();
      
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

  const handleMigrateToHome = (content: ExtractedContent) => {
    navigate('/', {
      state: {
        text: content.title,
        description: content.description,
      }
    });
    toast({
      title: "Contenuto migrato",
      description: "Il contenuto è stato trasferito alla home",
    });
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

  if (loading) return <LoadingState />;

  return (
    <div className="container mx-auto p-6">
      <Header />
      {contents.length === 0 ? (
        <EmptyState />
      ) : (
        <ContentTable
          contents={contents}
          expandedRows={expandedRows}
          onToggleRow={toggleRow}
          onDelete={handleDelete}
          onView={handleView}
          onMigrateToHome={handleMigrateToHome}
          onFetchContents={fetchContents}
        />
      )}
    </div>
  );
};

export default SavedContent;
