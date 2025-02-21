
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
  const deadline = new Date(created.getTime() + 48 * 60 * 60 * 1000); // 48 ore dalla data di salvataggio
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

  // Colori più saturi per i duplicati
  const duplicateColors = [
    'bg-purple-200',
    'bg-pink-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-orange-200',
    'bg-red-200',
    'bg-indigo-200',
    'bg-cyan-200',
    'bg-emerald-200'
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
