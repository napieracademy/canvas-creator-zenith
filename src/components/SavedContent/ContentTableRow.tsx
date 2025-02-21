
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, ImageIcon, Clock } from 'lucide-react';
import { ContentActions } from './ContentActions';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { ExtractedContent } from './types';
import type { ColumnVisibility } from './ColumnToggle';

interface ContentTableRowProps {
  content: ExtractedContent;
  isDuplicate: boolean;
  isSelected: boolean;
  columnVisibility: ColumnVisibility;
  timeRemaining: string;
  onToggleRow: (id: string) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onView: (content: ExtractedContent) => void;
  onMigrateToHome: (content: ExtractedContent) => void;
}

export const ContentTableRow = ({
  content,
  isDuplicate,
  isSelected,
  columnVisibility,
  timeRemaining,
  onToggleRow,
  onSelectRow,
  onDelete,
  onView,
  onMigrateToHome
}: ContentTableRowProps) => (
  <TableRow className={isDuplicate ? "bg-purple-50" : ""}>
    <TableCell className="w-[30px]">
      <Checkbox 
        checked={isSelected}
        onCheckedChange={(checked) => onSelectRow(content.id, checked as boolean)}
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
        <span className={timeRemaining?.startsWith("In") ? "text-red-500" : ""}>
          {timeRemaining}
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
);
