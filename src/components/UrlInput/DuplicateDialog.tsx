
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DuplicateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseDuplicate: () => void;
}

export const DuplicateDialog: React.FC<DuplicateDialogProps> = ({
  open,
  onOpenChange,
  onUseDuplicate
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Contenuto già presente</AlertDialogTitle>
          <AlertDialogDescription>
            Questo contenuto è già stato salvato nel database. 
            Vuoi comunque utilizzarlo nell'editor?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Annulla
          </AlertDialogCancel>
          <AlertDialogAction onClick={onUseDuplicate}>
            Usa comunque
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
