
import React from 'react';
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
import { ChevronDown, ChevronUp, Image as ImageIcon, ExternalLink, Trash2 } from 'lucide-react';
import { ContentActions } from './ContentActions';
import { ExpandedContent } from './ExpandedContent';
import { ColumnToggle, type ColumnVisibility } from './ColumnToggle';
import type { ExtractedContent } from './types';
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

  const handleColumnToggle = (columnKey: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === contents.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(contents.map(content => content.id)));
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
              <TableHead className="w-[30px]"></TableHead>
              {columnVisibility.image && <TableHead className="w-[50px] text-left">Img</TableHead>}
              {columnVisibility.id && <TableHead className="w-[100px] text-left">ID</TableHead>}
              {columnVisibility.title && <TableHead className="text-left">Titolo</TableHead>}
              {columnVisibility.link && <TableHead className="hidden md:table-cell w-[50px] text-center">Link</TableHead>}
              {columnVisibility.content && <TableHead className="hidden lg:table-cell text-left">Contenuto</TableHead>}
              {columnVisibility.extractionDate && <TableHead className="hidden lg:table-cell text-left">Data di estrazione</TableHead>}
              {columnVisibility.actions && <TableHead className="text-right">Azioni</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <React.Fragment key={content.id}>
                <TableRow className="cursor-pointer" onClick={() => onToggleRow(content.id)}>
                  <TableCell className="w-[30px]">
                    <Checkbox 
                      checked={selectedRows.has(content.id)}
                      onCheckedChange={(e) => handleSelectRow(content.id, e as unknown as React.MouseEvent)}
                      aria-label={`Select ${content.title}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="w-[30px]">
                    {expandedRows.has(content.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </TableCell>
                  {columnVisibility.image && (
                    <TableCell className="w-[50px] text-left">
                      {content.image_url ? (
                        <img
                          src={content.image_url}
                          alt={content.title}
                          className="w-8 h-8 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-sm text-left">
                      {content.id.substring(0, 8)}...
                    </TableCell>
                  )}
                  {columnVisibility.title && (
                    <TableCell className="font-medium text-left">
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
                    <TableCell className="hidden lg:table-cell max-w-xs truncate text-left">
                      {content.content?.substring(0, 100)}
                      {content.content?.length > 100 ? '...' : ''}
                    </TableCell>
                  )}
                  {columnVisibility.extractionDate && (
                    <TableCell className="hidden lg:table-cell text-left">
                      {new Date(content.extraction_date).toLocaleString('it-IT')}
                    </TableCell>
                  )}
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
