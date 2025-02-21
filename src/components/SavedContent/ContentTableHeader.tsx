
import React from 'react';
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnVisibility } from './ColumnToggle';

interface ContentTableHeaderProps {
  selectedRows: Set<string>;
  displayedContents: any[];
  columnVisibility: ColumnVisibility;
  onSelectAll: (checked: boolean) => void;
}

export const ContentTableHeader = ({
  selectedRows,
  displayedContents,
  columnVisibility,
  onSelectAll
}: ContentTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      <TableHead className="w-[30px]">
        <Checkbox 
          checked={selectedRows.size === displayedContents.length && displayedContents.length > 0}
          onCheckedChange={onSelectAll}
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
);
