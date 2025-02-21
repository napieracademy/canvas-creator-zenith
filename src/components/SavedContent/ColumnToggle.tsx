
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface ColumnVisibility {
  id: boolean;
  image: boolean;
  title: boolean;
  link: boolean;
  content: boolean;
  extractionDate: boolean;
  actions: boolean;
}

interface ColumnToggleProps {
  columns: ColumnVisibility;
  onColumnToggle: (key: keyof ColumnVisibility) => void;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({ columns, onColumnToggle }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Eye className="mr-2 h-4 w-4" />
          Visualizza colonne
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={columns.id}
          onCheckedChange={() => onColumnToggle('id')}
        >
          ID
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.image}
          onCheckedChange={() => onColumnToggle('image')}
        >
          Immagine
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.title}
          onCheckedChange={() => onColumnToggle('title')}
        >
          Titolo
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.link}
          onCheckedChange={() => onColumnToggle('link')}
        >
          Link
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.content}
          onCheckedChange={() => onColumnToggle('content')}
        >
          Contenuto
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.extractionDate}
          onCheckedChange={() => onColumnToggle('extractionDate')}
        >
          Data di estrazione
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.actions}
          onCheckedChange={() => onColumnToggle('actions')}
        >
          Azioni
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
