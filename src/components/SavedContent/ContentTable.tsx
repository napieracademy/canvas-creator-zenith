import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody } from "@/components/ui/table";
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
  onMigrateToHome
}: ContentTableProps) => {
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibility>({
    id: false,
    image: true,
    title: true,
    link: false,
    content: true,
    extractionDate: false,
    actions: true
  });

  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = React.useState<{[key: string]: string}>({});
  const [showDuplicates, setShowDuplicates] = React.useState(false);

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
    // Raggruppa i contenuti per URL
    const groupedByUrl = contents.reduce((acc, content) => {
      if (!acc[content.url]) {
        acc[content.url] = [];
      }
      acc[content.url].push(content);
      return acc;
    }, {} as { [key: string]: ExtractedContent[] });

    // Raccogli tutti gli ID da eliminare
    const idsToDelete = Object.values(groupedByUrl)
      .filter(group => group.length > 1) // Solo gruppi con duplicati
      .flatMap(group => {
        // Ordina per data di creazione (il più recente prima)
        const sortedGroup = group.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        // Prendi tutti gli ID tranne il primo (il più recente)
        return sortedGroup.slice(1).map(content => content.id);
      });

    // Elimina tutti gli ID in un'unica operazione
    if (idsToDelete.length > 0) {
      Promise.all(idsToDelete.map(id => onDelete(id)))
        .catch(error => {
          console.error('Errore durante l\'eliminazione bulk dei duplicati:', error);
        });
    }
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

  const handleBulkDelete = () => {
    selectedRows.forEach(id => {
      onDelete(id);
    });
    setSelectedRows(new Set());
  };

  // Colori molto più tenui per i duplicati
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

  // Crea una mappa di URL -> colore per i duplicati
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
