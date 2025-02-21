
import React from 'react';
import { Button } from "@/components/ui/button";
import { FilterX, Filter, Trash2, Copy } from 'lucide-react';
import { ColumnToggle, type ColumnVisibility } from './ColumnToggle';
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

interface ContentTableToolbarProps {
  selectedRows: Set<string>;
  showDuplicates: boolean;
  columnVisibility: ColumnVisibility;
  onDeleteSelected: () => void;
  onToggleDuplicates: () => void;
  onColumnToggle: (key: keyof ColumnVisibility) => void;
  onDeleteDuplicates: () => void;
  hasDuplicates: boolean;
}

export const ContentTableToolbar = ({
  selectedRows,
  showDuplicates,
  columnVisibility,
  onDeleteSelected,
  onToggleDuplicates,
  onColumnToggle,
  onDeleteDuplicates,
  hasDuplicates
}: ContentTableToolbarProps) => (
  <div className="flex justify-between items-center">
    <div className="flex gap-2">
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
              <AlertDialogAction onClick={onDeleteSelected}>Elimina</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleDuplicates}
        className={showDuplicates ? "bg-muted" : ""}
      >
        {showDuplicates ? (
          <FilterX className="h-4 w-4 mr-2" />
        ) : (
          <Filter className="h-4 w-4 mr-2" />
        )}
        {showDuplicates ? "Mostra tutti" : "Mostra duplicati"}
      </Button>
      {hasDuplicates && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Elimina duplicati
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Conferma eliminazione duplicati</AlertDialogTitle>
              <AlertDialogDescription>
                Verranno eliminati tutti i contenuti duplicati, mantenendo solo la versione più recente per ogni URL. Questa azione non può essere annullata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteDuplicates}>Elimina duplicati</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
    <div className="flex-grow flex justify-end">
      <ColumnToggle columns={columnVisibility} onColumnToggle={onColumnToggle} />
    </div>
  </div>
);
