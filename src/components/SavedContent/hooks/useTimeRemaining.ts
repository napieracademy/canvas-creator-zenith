
import { useState, useEffect } from 'react';
import type { ExtractedContent } from '../types';

const calculateTimeRemaining = (createdAt: string): string => {
  if (!createdAt) return "Data non disponibile";
  
  const created = new Date(createdAt);
  const deadline = new Date(created.getTime() + 48 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = deadline.getTime() - now.getTime();

  if (remaining <= 0) return "In eliminazione...";

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const useTimeRemaining = (contents: ExtractedContent[]) => {
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeRemaining: {[key: string]: string} = {};
      contents.forEach(content => {
        newTimeRemaining[content.id] = calculateTimeRemaining(content.created_at);
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, [contents]);

  return timeRemaining;
};
