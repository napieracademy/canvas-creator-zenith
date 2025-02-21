import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ExternalLink, Trash2, Clock } from 'lucide-react';
import { ContentActions } from './ContentActions';
import { ExpandedContent } from './ExpandedContent';
import { ColumnToggle, type ColumnVisibility } from './ColumnToggle';
import type { ExtractedContent } from './types';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeRemaining: {[key: string]: string} = {};
      contents.forEach(content => {
        newTimeRemaining[content.id] = calculateTimeRemaining(content.created_at);
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Aggiorna ogni minuto

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(contents.map(content => content.id)));
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {selectedRows.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina selezionati ({selectedRows.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Stai per eliminare {selectedRows.size} elementi selezionati. Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete}>Elimina</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex-grow flex justify-end">
          <ColumnToggle columns={columnVisibility} onColumnToggle={handleColumnToggle} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox 
                  checked={selectedRows.size === contents.length && contents.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              {columnVisibility.image && <TableHead className="w-[50px] text-left">Img</TableHead>}
              {columnVisibility.id && <TableHead className="w-[100px] text-left">ID</TableHead>}
              {columnVisibility.title && <TableHead className="text-left">Titolo</TableHead>}
              {columnVisibility.link && <TableHead className="hidden md:table-cell w-[50px] text-center">Link</TableHead>}
              {columnVisibility.content && <TableHead className="hidden lg:table-cell text-left">Contenuto</TableHead>}
              <TableHead className="w-[120px] text-center">Tempo rimasto</TableHead>
              {columnVisibility.actions && <TableHead className="text-right">Azioni</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <React.Fragment key={content.id}>
                <TableRow>
                  <TableCell className="w-[30px]">
                    <Checkbox 
                      checked={selectedRows.has(content.id)}
                      onCheckedChange={(checked) => handleSelectRow(content.id, checked as boolean)}
                      aria-label={`Select ${content.title}`}
                    />
                  </TableCell>
                  {columnVisibility.image && (
                    <TableCell className="w-[50px] text-left cursor-pointer" onClick={() => onToggleRow(content.id)}>
                      {content.image_url ? (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <img
                              src={content.image_url}
                              alt={content.title}
                              className="w-8 h-8 object-cover rounded cursor-pointer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-64 p-0">
                            <img
                              src={content.image_url}
                              alt={content.title}
                              className="w-full h-64 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-sm text-left cursor-pointer" onClick={() => onToggleRow(content.id)}>
                      {content.id.substring(0, 8)}...
                    </TableCell>
                  )}
                  {columnVisibility.title && (
                    <TableCell className="font-medium text-left cursor-pointer" onClick={() => onToggleRow(content.id)}>
                      {content.title || 'Senza titolo'}
                    </TableCell>
                  )}
                  {columnVisibility.link && (
                    <TableCell className="hidden md:table-cell w-[50px] text-center">
                      <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        title={content.url}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  )}
                  {columnVisibility.content && (
                    <TableCell className="hidden lg:table-cell max-w-xs truncate text-left cursor-pointer" onClick={() => onToggleRow(content.id)}>
                      {content.content?.substring(0, 100)}
                      {content.content?.length > 100 ? '...' : ''}
                    </TableCell>
                  )}
                  <TableCell className="w-[120px] text-center">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={timeRemaining[content.id]?.startsWith("In") ? "text-red-500" : ""}>
                        {timeRemaining[content.id]}
                      </span>
                    </div>
                  </TableCell>
                  {columnVisibility.actions && (
                    <TableCell className="text-right">
                      <ContentActions
                        content={content}
                        onDelete={onDelete}
                        onView={onView}
                        onMigrateToHome={onMigrateToHome}
                      />
                    </TableCell>
                  )}
                </TableRow>
                {expandedRows.has(content.id) && <ExpandedContent content={content} />}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
