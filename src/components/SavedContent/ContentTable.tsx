
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { ContentActions } from './ContentActions';
import { ExpandedContent } from './ExpandedContent';
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
}: ContentTableProps) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]"></TableHead>
          <TableHead className="w-[50px]">Img</TableHead>
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
            <TableRow className="cursor-pointer" onClick={() => onToggleRow(content.id)}>
              <TableCell className="w-[30px]">
                {expandedRows.has(content.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </TableCell>
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
                <ContentActions
                  content={content}
                  onDelete={onDelete}
                  onView={onView}
                  onMigrateToHome={onMigrateToHome}
                />
              </TableCell>
            </TableRow>
            {expandedRows.has(content.id) && <ExpandedContent content={content} />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  </div>
);
