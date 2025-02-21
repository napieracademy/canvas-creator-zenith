
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { ContentActions } from './ContentActions';
import { ExpandedContent } from './ExpandedContent';
import { ColumnToggle, type ColumnVisibility } from './ColumnToggle';
import type { ExtractedContent } from './types';

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
    id: true,
    image: true,
    title: true,
    link: true,
    content: true,
    extractionDate: true,
    actions: true
  });

  const handleColumnToggle = (columnKey: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnToggle columns={columnVisibility} onColumnToggle={handleColumnToggle} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              {columnVisibility.image && <TableHead className="w-[50px]">Img</TableHead>}
              {columnVisibility.id && <TableHead className="w-[100px]">ID</TableHead>}
              {columnVisibility.title && <TableHead>Titolo</TableHead>}
              {columnVisibility.link && <TableHead className="hidden md:table-cell w-[50px]">Link</TableHead>}
              {columnVisibility.content && <TableHead className="hidden lg:table-cell">Contenuto</TableHead>}
              {columnVisibility.extractionDate && <TableHead className="hidden lg:table-cell">Data di estrazione</TableHead>}
              {columnVisibility.actions && <TableHead className="text-right">Azioni</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <React.Fragment key={content.id}>
                <TableRow className="cursor-pointer" onClick={() => onToggleRow(content.id)}>
                  <TableCell className="w-[30px]">
                    {expandedRows.has(content.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </TableCell>
                  {columnVisibility.image && (
                    <TableCell className="w-[50px]">
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
                    <TableCell className="font-mono text-sm">
                      {content.id.substring(0, 8)}...
                    </TableCell>
                  )}
                  {columnVisibility.title && (
                    <TableCell className="font-medium">
                      {content.title || 'Senza titolo'}
                    </TableCell>
                  )}
                  {columnVisibility.link && (
                    <TableCell className="hidden md:table-cell w-[50px]">
                      <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                        title={content.url}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  )}
                  {columnVisibility.content && (
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {content.content?.substring(0, 100)}
                      {content.content?.length > 100 ? '...' : ''}
                    </TableCell>
                  )}
                  {columnVisibility.extractionDate && (
                    <TableCell className="hidden lg:table-cell">
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
