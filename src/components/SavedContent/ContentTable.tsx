import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { ExtractedContent } from './types';
import { ContentTableHeader } from './ContentTableHeader';
import { ContentTableToolbar } from './ContentTableToolbar';
import { ContentTableRow } from './ContentTableRow';
import { ExpandedContent } from './ExpandedContent';
import type { ColumnVisibility } from './ColumnToggle';

interface ContentTableProps {
  contents: ExtractedContent[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (content: ExtractedContent) => void;
  onMigrateToHome: (content: ExtractedContent) => void;
  onFetchContents: () => Promise<void>;
}

const calculateTimeRemaining = (createdAt: string): string => {
  if (!createdAt) return "Data non disponibile";
  
  const created = new Date(createdAt);
  const deadline = new Date(created.getTime() + 48 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = deadline.getTime() - now.getTime();

  if (remaining <= 0) return "In eliminazione...";

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const ContentTable = ({
  contents,
  expandedRows,
  onToggleRow,
  onDelete,
  onView,
  onMigrateToHome,
  onFetchContents
}: ContentTableProps) => {
  const { toast } = useToast();
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: false,
    image: true,
    title: true,
    link: false,
    content: true,
    extractionDate: false,
    actions: true
  });

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: string}>({});
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeRemaining: {[key: string]: string} = {};
      contents.forEach(content => {
        newTimeRemaining[content.id] = calculateTimeRemaining(content.created_at);
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, [contents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('extracted_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      toast({
        title: "Lista aggiornata",
        description: "I contenuti sono stati aggiornati con successo",
      });

      onFetchContents();
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della lista:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la lista dei contenuti",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleColumnToggle = (columnKey: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const getDuplicateUrls = () => {
    const urlCounts = contents.reduce((acc, content) => {
      acc[content.url] = (acc[content.url] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(urlCounts).filter(url => urlCounts[url] > 1);
  };

  const handleDeleteDuplicates = () => {
    const groupedByUrl = contents.reduce((acc, content) => {
      if (!acc[content.url]) {
        acc[content.url] = [];
      }
      acc[content.url].push(content);
      return acc;
    }, {} as { [key: string]: ExtractedContent[] });

    const idsToDelete = Object.values(groupedByUrl)
      .filter(group => group.length > 1)
      .flatMap(group => {
        const sortedGroup = group.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return sortedGroup.slice(1).map(content => content.id);
      });

    if (idsToDelete.length > 0) {
      Promise.all(idsToDelete.map(id => onDelete(id)))
        .then(() => {
          console.log('Aggiornamento contenuti dopo eliminazione bulk');
          onFetchContents();
        })
        .catch(error => {
          console.error('Errore durante l\'eliminazione bulk dei duplicati:', error);
        });
    }
  };

  const handleBulkDelete = () => {
    Promise.all(Array.from(selectedRows).map(id => onDelete(id)))
      .then(() => {
        console.log('Aggiornamento contenuti dopo eliminazione bulk selezionata');
        onFetchContents();
        setSelectedRows(new Set());
      })
      .catch(error => {
        console.error('Errore durante l\'eliminazione bulk:', error);
      });
  };

  const displayedContents = showDuplicates
    ? contents.filter(content => getDuplicateUrls().includes(content.url))
    : contents;

  const isDuplicate = (url: string) => getDuplicateUrls().includes(url);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(displayedContents.map(content => content.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const duplicateColors = [
    'bg-purple-50/50',
    'bg-pink-50/50',
    'bg-blue-50/50',
    'bg-green-50/50',
    'bg-yellow-50/50',
    'bg-orange-50/50',
    'bg-red-50/50',
    'bg-indigo-50/50',
    'bg-cyan-50/50',
    'bg-emerald-50/50'
  ];

  const urlColorMap = useMemo(() => {
    const colorMap = new Map<string, string>();
    let colorIndex = 0;

    const duplicateUrls = getDuplicateUrls();
    duplicateUrls.forEach(url => {
      colorMap.set(url, duplicateColors[colorIndex % duplicateColors.length]);
      colorIndex++;
    });

    return colorMap;
  }, [contents]);

  return (
    <div className="space-y-4">
      <ContentTableToolbar
        selectedRows={selectedRows}
        showDuplicates={showDuplicates}
        columnVisibility={columnVisibility}
        onDeleteSelected={handleBulkDelete}
        onToggleDuplicates={() => setShowDuplicates(!showDuplicates)}
        onColumnToggle={handleColumnToggle}
        onDeleteDuplicates={handleDeleteDuplicates}
        onRefresh={handleRefresh}
        hasDuplicates={getDuplicateUrls().length > 0}
      />
      <div className="rounded-md border">
        <Table>
          <ContentTableHeader
            selectedRows={selectedRows}
            displayedContents={displayedContents}
            columnVisibility={columnVisibility}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {displayedContents.map((content) => (
              <React.Fragment key={content.id}>
                <ContentTableRow
                  content={content}
                  isDuplicate={isDuplicate(content.url)}
                  isSelected={selectedRows.has(content.id)}
                  columnVisibility={columnVisibility}
                  timeRemaining={timeRemaining[content.id]}
                  urlColorMap={urlColorMap}
                  onToggleRow={onToggleRow}
                  onSelectRow={handleSelectRow}
                  onDelete={onDelete}
                  onView={onView}
                  onMigrateToHome={onMigrateToHome}
                />
                {expandedRows.has(content.id) && <ExpandedContent content={content} />}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
