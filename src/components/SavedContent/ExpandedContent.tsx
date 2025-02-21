
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import type { ExtractedContent } from './types';

interface ExpandedContentProps {
  content: ExtractedContent;
}

export const ExpandedContent = ({ content }: ExpandedContentProps) => (
  <TableRow>
    <TableCell colSpan={6} className="bg-muted/50 p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Descrizione</h3>
          <p className="text-sm text-muted-foreground">
            {content.description || 'Nessuna descrizione disponibile'}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contenuto Completo</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {content.content || 'Nessun contenuto disponibile'}
          </p>
        </div>
        {content.credits && (
          <div>
            <h3 className="font-semibold mb-2">Crediti</h3>
            <p className="text-sm text-muted-foreground">
              {content.credits}
            </p>
          </div>
        )}
      </div>
    </TableCell>
  </TableRow>
);
