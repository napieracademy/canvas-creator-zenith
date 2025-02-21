
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Home } from 'lucide-react';
import type { ExtractedContent } from './types';

interface ContentActionsProps {
  content: ExtractedContent;
  onDelete: (id: string) => void;
  onView: (content: ExtractedContent) => void;
  onMigrateToHome: (content: ExtractedContent) => void;
}

export const ContentActions = ({ content, onDelete, onView, onMigrateToHome }: ContentActionsProps) => (
  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => onMigrateToHome(content)}
      className="text-green-500 hover:text-green-700"
    >
      <Home className="h-4 w-4" />
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => onView(content)}
    >
      <Eye className="h-4 w-4" />
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => onDelete(content.id)}
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);
