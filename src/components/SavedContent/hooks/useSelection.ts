
import { useState } from 'react';
import type { ExtractedContent } from '../types';

export const useSelection = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (contents: ExtractedContent[], checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(contents.map(content => content.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  return {
    selectedRows,
    setSelectedRows,
    handleSelectRow,
    handleSelectAll
  };
};
