
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import type { ExtractedContent } from './types';
import { ContentTableHeader } from './ContentTableHeader';
import { ContentTableToolbar } from './ContentTableToolbar';
import { ContentTableRow } from './ContentTableRow';
import { ExpandedContent } from './ExpandedContent';
import type { ColumnVisibility } from './ColumnToggle';
import { useTimeRemaining } from './hooks/useTimeRemaining';
import { useContentRefresh } from './hooks/useContentRefresh';
import { useDuplicates } from './hooks/useDuplicates';
import { useSelection } from './hooks/useSelection';

interface ContentTableProps {
  contents: ExtractedContent[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (content: ExtractedContent) => void;
  onMigrateToHome: (content: ExtractedContent) => void;
  onFetchContents: () => Promise<void>;
}

export const ContentTable = ({
  contents,
  expandedRows,
  onToggleRow,
  onDelete,
  onView,
  onMigrateToHome,
  onFetchContents
}: ContentTableProps) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: false,
    image: true,
    title: true,
    link: false,
    content: true,
    extractionDate: false,
    actions: true
  });

  const [showDuplicates, setShowDuplicates] = useState(false);
  const timeRemaining = useTimeRemaining(contents);
  const { handleRefresh } = useContentRefresh(onFetchContents);
  const { getDuplicateUrls, urlColorMap, isDuplicate } = useDuplicates(contents);
  const { selectedRows, setSelectedRows, handleSelectRow, handleSelectAll } = useSelection();

  const handleColumnToggle = (columnKey: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
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
            onSelectAll={(checked) => handleSelectAll(displayedContents, checked)}
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
